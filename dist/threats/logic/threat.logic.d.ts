import { Threat } from './threats.interface';
export declare class ThreatsService {
    private splitToParagraphs;
    private splitToSentencies;
    private formatString;
    private getTLDs;
    private getTLDRegExpString;
    private sortByValue;
    private dedup;
    private matchesWithRegExp;
    private extractMD5;
    private extractSHA1;
    private extractSHA256;
    private extractSHA512;
    private extractSSDEEP;
    private extractASN;
    private _getInternationalizedDomainRegExpString;
    private getInternationalizedDomainRegExpString;
    private getInternationalizedDomainRegExp;
    private getNonStrictInternationalizedDomainRegExpString;
    private getNonStrictInternationalizedDomainRegExp;
    private _getDomainRegExpString;
    private getDomainRegExpString;
    private getDomainRegExp;
    private getNonStrictDomainRegExpString;
    private getNonStrictDomainRegExp;
    private extractDomain;
    private getEmailRegExp;
    private getNonStrictEmailRegExp;
    private getInternationalizedEmailRegExp;
    private getNonStrictInternationalizedEmailRegExp;
    private extractEmail;
    private getIPv4RegExpString;
    private getIPv4RegExp;
    private extractIPv4;
    private _getIPv6RegExpString;
    private getIPv6RegExpString;
    private getIPv6RegExp;
    private extractIPv6;
    private protocol;
    private auth;
    private path;
    private port;
    private getURLRegExp;
    private getNonStrictURLRegExp;
    private getInternationalizedURLRegExp;
    private getNonStrictInternationalizedURLRegExp;
    private extractURL;
    private getCVERegExp;
    private extractCVE;
    private getBTCRegExp;
    private extractBTC;
    private getXMRRegExp;
    private extractXMR;
    private getGAPubIDRegExp;
    private extractGAPubID;
    private getGATrackIDRegExp;
    private extractGATrackID;
    private getMACAddressRegExp;
    private extractMacAddress;
    private getETHRegExp;
    private extractETH;
    private getFilePathRegExp;
    private extractFilePath;
    private getDateRegExp;
    private extractDate;
    extractFileWithExtension(s: string): string[];
    extractCWE(s: string): string[];
    extractRegistry(s: string): string[];
    private extractElementsFromString;
    private threatFieldExtractor;
    private iocFieldExtractor;
    parse(inputString: string, fileName: string): Threat;
}
