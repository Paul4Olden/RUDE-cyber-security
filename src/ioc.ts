type IocType = 'IP' | 'HASH' | 'PATH' | 'DOMAIN_NAME' | 'FILENAME';
type Severity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH';
type Reputation = 'GOOD' | 'BAD' | 'SUSPICIOUS' | 'UNKNOWN';

export interface Vendor {
  vendorName: string;
  reputation: Reputation;
  reliability: string;
}

export interface Ioc {
  indicator: string;
  iocType: IocType;
  severity: Severity;
  expirationDate: number;
  comment: string;
  reputation: Reputation;
  vendors: Vendor[];
  class: string;
}
