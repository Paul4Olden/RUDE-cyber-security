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

export interface indicatorItem {
  indicatorItemID: string;
  condition: string;
  document: string;
  search: string;
  type: string;
  content: string;
}

export interface Indicator {
  indicatorId: string;
  indicatorItems: indicatorItem[];
  operator: string;
}

export interface Ioc2 {
  indicator: Indicator[];
  threatcategory: string;
  threatgroup: string;
  category: string;
  family: string;
  license: string;
  reputation: Reputation;
  authorName: string;
  date: Date;
  description: string;
  class: string;
}
