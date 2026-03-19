import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitorServiceProxy } from '../../../core/service-proxies';
import { TokenServiceProxy } from '../../../core/service-proxies';

@Component({
  selector: 'app-token-generate',
  templateUrl: './token-generate.component.html',
  styleUrls: ['./token-generate.component.scss']
})
export class TokenGenerateComponent implements OnInit {
  visitor: any = null;
  selectedType = 'General';
  tokenGenerated = false;
  generatedToken: any = null;

  tokenTypes = [
    { type: 'General', icon: 'badge', description: 'Standard visitor pass' },
    { type: 'Guest', icon: 'person', description: 'Guest/VIP access' },
    { type: 'Delivery', icon: 'local_shipping', description: 'Delivery personnel' },
    { type: 'Maintenance', icon: 'build', description: 'Maintenance staff' },
    { type: 'Doctor Visit', icon: 'medical_services', description: 'Medical appointment' }
  ];

  constructor(
    private visitorService: VisitorServiceProxy,
    private tokenService: TokenServiceProxy,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const visitorId = this.route.snapshot.queryParams['visitorId'];
    if (visitorId) {
      this.visitorService.getVisitorById(+visitorId).subscribe(res => {
        this.visitor = res.data;
      });
    }
  }

  generateToken(): void {
    if (!this.visitor) return;

    this.tokenService.getAllTokens().subscribe(res => {
      const tokens = res.data.items;
      const newId = Math.max(...tokens.map(t => t.id), 0) + 1;
      const now = new Date();
      const expiry = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours

      this.generatedToken = {
        id: newId,
        tokenNo: `TK-${now.getFullYear()}-${String(newId).padStart(4, '0')}`,
        visitorId: this.visitor.id,
        visitorName: this.visitor.name,
        type: this.selectedType,
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
