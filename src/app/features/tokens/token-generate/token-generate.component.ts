import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  VisitorServiceProxy } from '../../../core/service-proxies';
import { TokenServiceProxy } from '../../../core/service-proxies';
import { MdmServiceProxy } from '../../../core/service-proxies';
import { MdmType } from '../../../core/models/mdm.model';
import { TokenType } from '../../../core/models/token.model';
import { Visitor } from '../../../core/models/visitor.model';
import { resolveIcon } from '../../../core/utils/icon-resolver';

@Component({
  selector: 'app-token-generate',
  templateUrl: './token-generate.component.html',
  styleUrls: ['./token-generate.component.scss']
})
export class TokenGenerateComponent implements OnInit {

  visitor: Visitor = new Visitor();
  selectedType: TokenType = new TokenType();
  tokenGenerated = false;
  generatedToken: any = null;

  tokenTypes: TokenType[] = [];

  constructor(
    private visitorService: VisitorServiceProxy,
    private tokenService: TokenServiceProxy,
    private mdmService: MdmServiceProxy,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTokenTypes();

    const visitorId = this.route.snapshot.queryParams['visitorId'];
    if (visitorId) {
      this.visitorService.getVisitorById(visitorId).subscribe(res => {
        this.visitor = res.data;
      });
    }
  }

  private loadTokenTypes(): void {
    this.mdmService.getAll(MdmType.TokenType).subscribe({
      next: res => {
        const items = (res.data ?? []).filter(item => item.isActive);
        this.tokenTypes = items.map(item => ({
          type: item.value,
          icon: resolveIcon(item.code),
          description: item.code
        }));
        if (this.tokenTypes.length > 0) {
          this.selectedType = this.tokenTypes[0];
        }
      },
      error: () => {
        // Fallback to static defaults if MDM fails
        this.tokenTypes = [
          { type: 'General', icon: 'badge', description: 'Standard visitor pass' },
          { type: 'Guest', icon: 'person', description: 'Guest/VIP access' },
          { type: 'Delivery', icon: 'local_shipping', description: 'Delivery personnel' },
          { type: 'Maintenance', icon: 'build', description: 'Maintenance staff' },
          { type: 'Doctor Visit', icon: 'medical_services', description: 'Medical appointment' }
        ];
        this.selectedType = this.tokenTypes[0];
      }
    });
  }

  generateToken(): void {
    if (!this.visitor) return;

    this.tokenService.getAllTokens().subscribe(res => {
      const tokens = res.data.items;
      // const newId = Math.max(...tokens.map(t => t.id), 0) + 1;
      const newId = Math.max(tokens.filter(t=>t.issueTime.getDate() === new Date().getDate()).length, 0) + 1;
      const now = new Date();
      const expiry = new Date(now.getTime() + 2 * 60 * 60 * 1000); // default expiry 2 hours
      const experyExpectation = new Date(this.visitor.expectedDuration ?? now.getTime() + 2 * 60 * 60 * 1000);
      
      if (experyExpectation > expiry) { // If visitor's expected duration is longer than default, use that as expiry
        expiry.setTime(experyExpectation.getTime());
      }

      const tokenNo = `TK-${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}-${String(newId).padStart(4, '0')}`;

      this.generatedToken = {
        tokenNo: tokenNo,
        visitorId: this.visitor.id,
        visitorName: this.visitor.name,
        type: this.selectedType.description,
        issueTime: now.toISOString(),
        expiry: expiry.toISOString(),
        status: 'active',
        hostName: this.visitor.hostName
      };

      this.tokenService.createToken(this.generatedToken).subscribe(() => {
        this.tokenGenerated = true;
      });
    });
  }

  done(): void {
    this.router.navigate(['/tokens']);
  }
}
