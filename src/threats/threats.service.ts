import { Injectable } from '@nestjs/common';
import * as arrayUnique from 'array-unique';
import * as fs from 'fs';
import * as path from 'path';
import * as memoize from 'memoizee';
import { IocField, Malware, Threat, ThreatFiled } from './threats.interface';
import { threatGroup } from './threatGroupID';
import { industries } from './industries';
import { keywords } from './keywords';

@Injectable()
export class ThreatsService {
  private splitToParagraphs(input: string): string[] {
    return input.split(/((?<!:))\n\n/g);
  }

  private splitToSentencies(input: string): string[] {
    return input.split(/?:[.!?]['"]?\s{1,2}(?=[A-Z])/g);
  }

  private formatString(input): string {
    return input.replace(/[\n]{3,}/g, '');
  }

  private getTLDs(): string[] {
    const filePath = path.resolve(__dirname, './tlds.txt');
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const lines = data.split(/\r?\n/);
      return lines.filter((line) => line.length > 0);
    } catch (_err) {
      return [];
    }
  }

  private getTLDRegExpString = (): string => {
    return this.getTLDs().join('|');
  };

  private sortByValue(array: string[]): string[] {
    return array.sort();
  }

  private dedup(array: string[]): string[] {
    return arrayUnique(array);
  }

  private matchesWithRegExp(s: string, regexp: RegExp): string[] {
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const matched = s.match(regexp);
    return matched === null ? [] : this.sortByValue(this.dedup(matched));
  }

  private extractMD5(s: string): string[] {
    const regexp = /\b[A-Fa-f0-9]{32}\b/gi;
    return this.matchesWithRegExp(s, regexp);
  }

  private extractSHA1(s: string): string[] {
    const regexp = /\b[A-Fa-f0-9]{40}\b/gi;
    return this.matchesWithRegExp(s, regexp);
  }

  private extractSHA256(s: string): string[] {
    const regexp = /\b[A-Fa-f0-9]{64}\b/gi;
    return this.matchesWithRegExp(s, regexp);
  }

  private extractSHA512(s: string): string[] {
    const regexp = /\b[A-Fa-f0-9]{128}\b/gi;
    return this.matchesWithRegExp(s, regexp);
  }

  private extractSSDEEP(s: string): string[] {
    const regexp = /\b\d{1,}:[A-Za-z0-9/+]{3,}:[A-Za-z0-9/+]{3,}/gi;
    return this.matchesWithRegExp(s, regexp);
  }

  private extractASN(s: string): string[] {
    const regexp = /(AS|ASN)\d+/gi;
    return this.matchesWithRegExp(s, regexp);
  }

  private _getInternationalizedDomainRegExpString = (): string => {
    const tld = this.getTLDRegExpString();
    return `(([a-z0-9\\u00a1-\\uffff]{1,63}|xn--)((?!.{0,63}--)[a-z0-9\\u00a1-\\uffff-]{0,63}[a-z0-9\\u00a1-\\uffff])?\\.)+(${tld})\\b`;
  };

  private getInternationalizedDomainRegExpString = memoize(
    this._getInternationalizedDomainRegExpString,
  );

  private getInternationalizedDomainRegExp = (): RegExp => {
    const internationalizedDomain = this.getInternationalizedDomainRegExpString();
    return new RegExp(internationalizedDomain, 'gi');
  };

  private getNonStrictInternationalizedDomainRegExpString = () => {
    return '(([a-z0-9\\u00a1-\\uffff]{1,63}|xn--)((?!.{0,63}--)[a-z0-9\\u00a1-\\uffff-]{0,63}[a-z0-9\\u00a1-\\uffff])?\\.)+(?:[a-z0-9\\u00a1-\\uffff-]{2,63})\\b';
  };

  private getNonStrictInternationalizedDomainRegExp = (): RegExp => {
    const nonStrictInternationalizedDomain = this.getNonStrictInternationalizedDomainRegExpString();
    return new RegExp(nonStrictInternationalizedDomain, 'gi');
  };

  private _getDomainRegExpString = (): string => {
    const tld = this.getTLDRegExpString();
    return `(([a-z0-9]{1,63}|xn--)((?!.{0,63}--)[a-z0-9-]{0,63}[a-z0-9])?\\.)+(${tld})\\b`;
  };

  private getDomainRegExpString = memoize(this._getDomainRegExpString);

  private getDomainRegExp = (): RegExp => {
    const domain = this.getDomainRegExpString();
    return new RegExp(domain, 'gi');
  };

  private getNonStrictDomainRegExpString = (): string => {
    return '(([a-z0-9]{1,63}|xn--)((?!.{0,63}--)[a-z0-9-]{0,63}[a-z0-9])?\\.)+(?:[a-z-]{2,})';
  };

  private getNonStrictDomainRegExp = (): RegExp => {
    const nonStrictDomain = this.getNonStrictDomainRegExpString();
    return new RegExp(nonStrictDomain, 'gi');
  };

  private extractDomain(
    s: string,
    enableIDN = true,
    strictTLD = true,
  ): string[] {
    if (enableIDN && strictTLD) {
      const internationalizedDomainRegExp = this.getInternationalizedDomainRegExpString();
      return this.matchesWithRegExp(s, internationalizedDomainRegExp);
    }

    if (enableIDN) {
      const nonStrictInternationalizedDomainRegExp = this.getNonStrictInternationalizedDomainRegExp();
      return this.matchesWithRegExp(s, nonStrictInternationalizedDomainRegExp);
    }

    if (strictTLD) {
      const domainRegExp = this.getDomainRegExp();
      return this.matchesWithRegExp(s, domainRegExp);
    }

    const nonStrictDomainRegExp = this.getNonStrictDomainRegExp();
    return this.matchesWithRegExp(s, nonStrictDomainRegExp);
  }

  private getEmailRegExp = (): RegExp => {
    const domain = this.getDomainRegExpString();
    return new RegExp(`[A-Za-z0-9_.]+@${domain}`, 'gi');
  };

  private getNonStrictEmailRegExp = (): RegExp => {
    const nonStrictDomain = this.getNonStrictDomainRegExpString();
    return new RegExp(`[A-Za-z0-9_.]+@${nonStrictDomain}`, 'gi');
  };

  private getInternationalizedEmailRegExp = (): RegExp => {
    const internationalizedDomain = this.getInternationalizedDomainRegExpString();
    return new RegExp(`[A-Za-z0-9_.]+@${internationalizedDomain}`, 'gi');
  };

  private getNonStrictInternationalizedEmailRegExp = (): RegExp => {
    const nonStrictInternationalizedDomain = this.getNonStrictInternationalizedDomainRegExpString();
    return new RegExp(
      `[A-Za-z0-9_.]+@${nonStrictInternationalizedDomain}`,
      'gi',
    );
  };

  private extractEmail(
    s: string,
    enableIDN = true,
    strictTLD = true,
  ): string[] {
    if (enableIDN && strictTLD) {
      const internationalizedEmailRegExp = this.getInternationalizedEmailRegExp();
      return this.matchesWithRegExp(s, internationalizedEmailRegExp);
    }

    if (enableIDN) {
      const nonStrictInternationalizedEmailRegExp = this.getNonStrictInternationalizedEmailRegExp();
      return this.matchesWithRegExp(s, nonStrictInternationalizedEmailRegExp);
    }

    if (strictTLD) {
      const emailRegExp = this.getEmailRegExp();
      return this.matchesWithRegExp(s, emailRegExp);
    }

    const nonStrictEmailRegExp = this.getNonStrictEmailRegExp();
    return this.matchesWithRegExp(s, nonStrictEmailRegExp);
  }

  private getIPv4RegExpString = (): string => {
    return '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\[?\\.]?){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
  };

  private getIPv4RegExp = (): RegExp => {
    const ipv4 = this.getIPv4RegExpString();
    return new RegExp(ipv4, 'gi');
  };

  private extractIPv4(s: string): string[] {
    const regexp = this.getIPv4RegExp();
    return this.matchesWithRegExp(s, regexp);
  }

  private _getIPv6RegExpString = (): string => {
    const ipv4 = this.getIPv4RegExpString();
    const v6seg = '[a-fA-F\\d]{1,4}';
    const ipv6 = `
    (
    (?:${v6seg}:){7}(?:${v6seg}|:)|                                // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
    (?:${v6seg}:){6}(?:${ipv4}|:${v6seg}|:)|                         // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
    (?:${v6seg}:){5}(?::${ipv4}|(:${v6seg}){1,2}|:)|                 // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
    (?:${v6seg}:){4}(?:(:${v6seg}){0,1}:${ipv4}|(:${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
    (?:${v6seg}:){3}(?:(:${v6seg}){0,2}:${ipv4}|(:${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
    (?:${v6seg}:){2}(?:(:${v6seg}){0,3}:${ipv4}|(:${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
    (?:${v6seg}:){1}(?:(:${v6seg}){0,4}:${ipv4}|(:${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
    (?::((?::${v6seg}){0,5}:${ipv4}|(?::${v6seg}){1,7}|:))           // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
    )(%[0-9a-zA-Z]{1,})?                                           // %eth0            %1
    `
      .replace(/\s*\/\/.*$/gm, '')
      .replace(/\n/g, '')
      .trim();
    return ipv6;
  };

  private getIPv6RegExpString = memoize(this._getIPv6RegExpString);

  getIPv6RegExp = (): RegExp => {
    const ipv6 = this.getIPv6RegExpString();
    return new RegExp(ipv6, 'gi');
  };

  private extractIPv6(s: string): string[] {
    const regexp = this.getIPv6RegExp();
    return this.matchesWithRegExp(s, regexp);
  }

  private protocol = '(?:(?:https?)://)';
  private auth = '(?:\\S+(?::\\S*)?@)?';
  private path = '(?:[/?#][^\\s"]*)?';
  private port = '(?::\\d{2,5})?';

  private getURLRegExp = (): RegExp => {
    const domain = this.getDomainRegExpString();
    const ipv4 = this.getIPv4RegExpString();
    const url = `(?:${this.protocol})${this.auth}(?:${domain}|localhost|${ipv4})${this.port}${path}`;
    return new RegExp(url, 'gi');
  };

  private getNonStrictURLRegExp = (): RegExp => {
    const nonStrictDomain = this.getNonStrictDomainRegExpString();
    const ipv4 = this.getIPv4RegExpString();
    const nonStrictURL = `(?:${this.protocol})${this.auth}(?:${nonStrictDomain}|localhost|${ipv4})${this.port}${path}`;
    return new RegExp(nonStrictURL, 'gi');
  };

  private getInternationalizedURLRegExp = (): RegExp => {
    const internationalizedDomain = this.getInternationalizedDomainRegExpString();
    const ipv4 = this.getIPv4RegExpString();
    const internationalizedURL = `(?:${this.protocol})${this.auth}(?:${internationalizedDomain}|localhost|${ipv4})${this.port}${path}`;
    return new RegExp(internationalizedURL, 'gi');
  };

  private getNonStrictInternationalizedURLRegExp = (): RegExp => {
    const nonStrictInternationalizedDomain = this.getNonStrictInternationalizedDomainRegExpString();
    const ipv4 = this.getIPv4RegExpString();
    const nonStrictInternationalizedURL = `(?:${this.protocol})${this.auth}(?:${nonStrictInternationalizedDomain}|localhost|${ipv4})${this.port}${path}`;
    return new RegExp(nonStrictInternationalizedURL, 'gi');
  };

  private extractURL(s: string, enableIDN = true, strictTLD = true): string[] {
    if (enableIDN && strictTLD) {
      const internationalizedURLRegExp = this.getInternationalizedURLRegExp();
      return this.matchesWithRegExp(s, internationalizedURLRegExp);
    }

    if (enableIDN) {
      const nonStrictInternationalizedURLRegExp = this.getNonStrictInternationalizedURLRegExp();
      return this.matchesWithRegExp(s, nonStrictInternationalizedURLRegExp);
    }

    if (strictTLD) {
      const urlRegExp = this.getURLRegExp();
      return this.matchesWithRegExp(s, urlRegExp);
    }

    const nonStrictURLRegExp = this.getNonStrictURLRegExp();
    return this.matchesWithRegExp(s, nonStrictURLRegExp);
  }

  private getCVERegExp = (): RegExp => {
    return /(CVE-(19|20)\d{2}-\d{4,7})/gi;
  };

  private extractCVE(s: string): string[] {
    const regexp = this.getCVERegExp();
    return this.matchesWithRegExp(s, regexp);
  }

  private getBTCRegExp = (): RegExp => {
    return /\b[13][a-km-zA-HJ-NP-Z0-9]{26,33}\b/gi;
  };

  private extractBTC(s: string): string[] {
    const regexp = this.getBTCRegExp();
    return this.matchesWithRegExp(s, regexp);
  }

  private getXMRRegExp = (): RegExp => {
    return /\b4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}\b/gi;
  };

  private extractXMR(s: string): string[] {
    const regexp = this.getXMRRegExp();
    return this.matchesWithRegExp(s, regexp);
  }

  private getGAPubIDRegExp = (): RegExp => {
    return /pub-\d{16}/gi;
  };

  private extractGAPubID(s: string): string[] {
    const regexp = this.getGAPubIDRegExp();
    return this.matchesWithRegExp(s, regexp);
  }

  private getGATrackIDRegExp = (): RegExp => {
    return /UA-\d{4,9}(-\d{1,2})?/gi;
  };

  private extractGATrackID(s: string): string[] {
    const regexp = this.getGATrackIDRegExp();
    return this.matchesWithRegExp(s, regexp);
  }

  private getMACAddressRegExp = (): RegExp => {
    return /\b(?:[A-Fa-f0-9]{2}([-:]))(?:[A-Fa-f0-9]{2}\1){4}[A-Fa-f0-9]{2}\b/gi;
  };

  private extractMacAddress(s: string): string[] {
    const regexp = this.getMACAddressRegExp();
    return this.matchesWithRegExp(s, regexp);
  }

  private getETHRegExp = (): RegExp => {
    return /\b0x[a-fA-F0-9]{40}\b/gi;
  };

  private extractETH(s: string): string[] {
    const regexp = this.getETHRegExp();
    return this.matchesWithRegExp(s, regexp);
  }

  private getFilePathRegExp = (): RegExp => {
    return /(?:[a-zA-Z]:|\\\\[a-z0-9_.$\●-]+\\[a-z0-9_.$\●-]+)\\.+?(?=\.[a-zA-Z]|).+?\s/g;
  };

  private extractFilePath(s: string): string[] {
    const regexp = this.getFilePathRegExp();
    return this.matchesWithRegExp(s, regexp);
  }

  private getDateRegExp = (): RegExp => {
    return /[0123][0,1]?\d{1}[\/\.\\\-](([0-2]?\d{1})|([3][0,1]{1}))[\/\.\\\-](([1]{1}[9]{1}[9]{1}\d{1})|([2-9]{1}\d{3}))/g;
  };

  private extractDate(s: string): string[] {
    const regexp = this.getDateRegExp();
    return this.matchesWithRegExp(s, regexp);
  }

  public extractFileWithExtension(s: string): string[] {
    const regexp = /[^\s\/\\]+\.(?:(?:[dD][oO][cC][xX]?)|(?:[pP][dD][fF])|(?:[eE][xX][eE])|(?:[dD][lL][lL])|(?:[pP][dD][bB])|(?:[sS][cC][rR])|(?:[vV][bB][sS])|(?:[rR][tT][fF])|(?:[xX][lL][sS])|(?:[jJ][pP][gG])|(?:[zZ][iI][pP]))/g;
    return this.matchesWithRegExp(s, regexp);
  }

  public extractCWE(s: string): string[] {
    const regexp = /(CVE-(19|20)\d{2}-\d{4,7})/gi;
    return this.matchesWithRegExp(s, regexp);
  }

  public extractRegistry(s: string): string[] {
    const regexp = /(HKEY_LOCAL_MACHINE\\|HKLM\\)([a-zA-Z0-9\s_@\-\^!#.\:\/\$%&+={}\[\]\\*])+(?<!\S)/igm;
    return this.matchesWithRegExp(s, regexp);
  }

  private extractElementsFromString(arr: string[], input: string) {
    return arr.reduce((out: string[], el: string) => {
      input.includes(el) && arr.indexOf(el) === 0 ? out.push(el) : '';
      return out;
    }, []);
  }

  private threatFieldExtractor(
    callback: Function, 
    threatField: ThreatFiled[], 
    input: string, 
    additional: string[] = undefined
  ): void {
    let extract = additional !== undefined ? callback(additional, input) : callback(input);
    if (extract !== []) 
      threatField.push({
        parameter: extract.join(' '),
        info: input
      });
  }

  private iocFieldExtractor(
    callback: Function,
    iocField: IocField[],
    input: string,
    paragraph: string,
    danger: boolean
  ): void {
    let extract = callback(input);
    if (extract !== []) 
      iocField.push({
        parameter: extract.join(' '),
        info: paragraph,
        dangerous: danger,
      });
  }

  //find all matches for regexps or keywords in the file
  public parse(inputString: string, fileName: string): Threat {
    const threat: Threat = {
      threadUID: '',
      name: fileName.replace('_', ' '),
      cve: [],
      cwe: [],
      software: [],
      malware: [],
      threatActor: [],
      industry: [],
      mitreAattack: [],
      county: [],
      city: [],
      timeStamp: [],
      ioc: {
        ipv4: [],
        ipv6: [],
        domain: [],
        email: [],
        md5: [],
        registryKey: [],
        sha1: [],
        sha256: [],
        sha512: [],
        ssdeep: [],
        url: []
      },
      document: '',
      rating: '',
      comment: ''
    };

    threat.document = this.formatString(inputString);
    this.splitToParagraphs(threat.document).map((paragraph: string) => {
      this.threatFieldExtractor(this.extractElementsFromString, threat.threatActor, paragraph, threatGroup);
      this.threatFieldExtractor(this.extractElementsFromString, threat.industry, paragraph, industries);
      this.threatFieldExtractor(this.extractCVE, threat.cve, paragraph);
      this.threatFieldExtractor(this.extractCWE, threat.cwe, paragraph);

      
      let keywordConnections = this.extractElementsFromString(keywords, paragraph);
      if (keywordConnections !== []) {
        this.splitToSentencies(paragraph).map((sentence: string) => {
          this.iocFieldExtractor(this.extractURL, threat.ioc.url, sentence, paragraph, true);
          this.iocFieldExtractor(this.extractDomain, threat.ioc.domain, sentence, paragraph, true);
          this.iocFieldExtractor(this.extractIPv4, threat.ioc.ipv4, sentence, paragraph, true);
          this.iocFieldExtractor(this.extractIPv6, threat.ioc.ipv6, sentence, paragraph, true);
          this.iocFieldExtractor(this.extractEmail, threat.ioc.email, sentence, paragraph, true);
          this.iocFieldExtractor(this.extractRegistry, threat.ioc.registryKey, sentence, paragraph, true);
          this.iocFieldExtractor(this.extractMD5, threat.ioc.md5, sentence, paragraph, true);
          this.iocFieldExtractor(this.extractSHA1, threat.ioc.sha1, sentence, paragraph, true);
          this.iocFieldExtractor(this.extractSHA256, threat.ioc.sha256, sentence, paragraph, true);
          this.iocFieldExtractor(this.extractSHA512, threat.ioc.sha512, sentence, paragraph, true);
          this.iocFieldExtractor(this.extractSSDEEP, threat.ioc.ssdeep, sentence, paragraph, true);
          this.threatFieldExtractor(this.extractDate, threat.timeStamp, paragraph);
        });
      }  
      else {
        this.splitToSentencies(paragraph).map((sentence: string) => {
          this.iocFieldExtractor(this.extractURL, threat.ioc.url, sentence, paragraph, false);
          this.iocFieldExtractor(this.extractDomain, threat.ioc.domain, sentence, paragraph, false);
          this.iocFieldExtractor(this.extractIPv4, threat.ioc.ipv4, sentence, paragraph, false);
          this.iocFieldExtractor(this.extractIPv6, threat.ioc.ipv6, sentence, paragraph, false);
          this.iocFieldExtractor(this.extractEmail, threat.ioc.email, sentence, paragraph, false);
          this.iocFieldExtractor(this.extractRegistry, threat.ioc.registryKey, sentence, paragraph, false);
          this.iocFieldExtractor(this.extractMD5, threat.ioc.md5, sentence, paragraph, false);
          this.iocFieldExtractor(this.extractSHA1, threat.ioc.sha1, sentence, paragraph, false);
          this.iocFieldExtractor(this.extractSHA256, threat.ioc.sha256, sentence, paragraph, false);
          this.iocFieldExtractor(this.extractSHA512, threat.ioc.sha512, sentence, paragraph, false);
          this.iocFieldExtractor(this.extractSSDEEP, threat.ioc.ssdeep, sentence, paragraph, false);
          this.threatFieldExtractor(this.extractDate, threat.timeStamp, paragraph);
        });
      }
    });
    
    return threat;
  }
}
