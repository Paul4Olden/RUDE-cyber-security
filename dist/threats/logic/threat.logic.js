"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreatLogic = void 0;
const arrayUnique = require("array-unique");
const fs = require("fs");
const path = require("path");
const memoize = require("memoizee");
const threatGroupID_1 = require("./threatGroupID");
const industries_1 = require("./industries");
const keywords_1 = require("./keywords");
const common_1 = require("@nestjs/common");
let ThreatLogic = class ThreatLogic {
    constructor() {
        this.threats = [];
        this.getInternationalizedDomainRegExpString = memoize(this._getInternationalizedDomainRegExpString);
        this.getDomainRegExpString = memoize(this._getDomainRegExpString);
        this.getIPv6RegExpString = memoize(this._getIPv6RegExpString);
        this.protocol = '(?:(?:https?)://)';
        this.auth = '(?:\\S+(?::\\S*)?@)?';
        this.path = '(?:[/?#][^\\s"]*)?';
        this.port = '(?::\\d{2,5})?';
    }
    getAllThreats() {
        return this.threats;
    }
    splitToParagraphs(input) {
        return input.split(/((?<!:))\n\n/g);
    }
    splitToSentencies(input) {
        return input.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/gm);
    }
    formatString(input) {
        return input.replace(/[\n]{3,}/g, '');
    }
    getTLDs() {
        const filePath = path.resolve(__dirname, './tlds.txt');
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            const lines = data.split(/\r?\n/);
            return lines.filter((line) => line.length > 0);
        }
        catch (_err) {
            return [];
        }
    }
    getTLDRegExpString() {
        return this.getTLDs().join('|');
    }
    sortByValue(array) {
        return array.sort();
    }
    dedup(array) {
        return arrayUnique(array);
    }
    matchesWithRegExp(s, regexp) {
        const matched = s.match(regexp);
        return matched === null ? null : this.sortByValue(this.dedup(matched));
    }
    extractMD5(s) {
        const regexp = /\b[A-Fa-f0-9]{32}\b/gi;
        return this.matchesWithRegExp(s, regexp);
    }
    extractSHA1(s) {
        const regexp = /\b[A-Fa-f0-9]{40}\b/gi;
        return this.matchesWithRegExp(s, regexp);
    }
    extractSHA256(s) {
        const regexp = /\b[A-Fa-f0-9]{64}\b/gi;
        return this.matchesWithRegExp(s, regexp);
    }
    extractSHA512(s) {
        const regexp = /\b[A-Fa-f0-9]{128}\b/gi;
        return this.matchesWithRegExp(s, regexp);
    }
    extractSSDEEP(s) {
        const regexp = /\b\d{1,}:[A-Za-z0-9/+]{3,}:[A-Za-z0-9/+]{3,}/gi;
        return this.matchesWithRegExp(s, regexp);
    }
    extractASN(s) {
        const regexp = /(AS|ASN)\d+/gi;
        return this.matchesWithRegExp(s, regexp);
    }
    _getInternationalizedDomainRegExpString() {
        const tld = this.getTLDRegExpString();
        return `(([a-z0-9\\u00a1-\\uffff]{1,63}|xn--)((?!.{0,63}--)[a-z0-9\\u00a1-\\uffff-]{0,63}[a-z0-9\\u00a1-\\uffff])?\\.)+(${tld})\\b`;
    }
    getInternationalizedDomainRegExp() {
        const internationalizedDomain = this.getInternationalizedDomainRegExpString();
        return new RegExp(internationalizedDomain, 'gi');
    }
    getNonStrictInternationalizedDomainRegExpString() {
        return '(([a-z0-9\\u00a1-\\uffff]{1,63}|xn--)((?!.{0,63}--)[a-z0-9\\u00a1-\\uffff-]{0,63}[a-z0-9\\u00a1-\\uffff])?\\.)+(?:[a-z0-9\\u00a1-\\uffff-]{2,63})\\b';
    }
    getNonStrictInternationalizedDomainRegExp() {
        const nonStrictInternationalizedDomain = this.getNonStrictInternationalizedDomainRegExpString();
        return new RegExp(nonStrictInternationalizedDomain, 'gi');
    }
    _getDomainRegExpString() {
        const tld = this.getTLDRegExpString();
        return `(([a-z0-9]{1,63}|xn--)((?!.{0,63}--)[a-z0-9-]{0,63}[a-z0-9])?\\.)+(${tld})\\b`;
    }
    getDomainRegExp() {
        const domain = this.getDomainRegExpString();
        return new RegExp(domain, 'gi');
    }
    getNonStrictDomainRegExpString() {
        return '(([a-z0-9]{1,63}|xn--)((?!.{0,63}--)[a-z0-9-]{0,63}[a-z0-9])?\\.)+(?:[a-z-]{2,})';
    }
    getNonStrictDomainRegExp() {
        const nonStrictDomain = this.getNonStrictDomainRegExpString();
        return new RegExp(nonStrictDomain, 'gi');
    }
    extractDomain(s, enableIDN = true, strictTLD = true) {
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
    getEmailRegExp() {
        const domain = this.getDomainRegExpString();
        return new RegExp(`[A-Za-z0-9_.]+@${domain}`, 'gi');
    }
    getNonStrictEmailRegExp() {
        const nonStrictDomain = this.getNonStrictDomainRegExpString();
        return new RegExp(`[A-Za-z0-9_.]+@${nonStrictDomain}`, 'gi');
    }
    getInternationalizedEmailRegExp() {
        const internationalizedDomain = this.getInternationalizedDomainRegExpString();
        return new RegExp(`[A-Za-z0-9_.]+@${internationalizedDomain}`, 'gi');
    }
    getNonStrictInternationalizedEmailRegExp() {
        const nonStrictInternationalizedDomain = this.getNonStrictInternationalizedDomainRegExpString();
        return new RegExp(`[A-Za-z0-9_.]+@${nonStrictInternationalizedDomain}`, 'gi');
    }
    extractEmail(s, enableIDN = true, strictTLD = true) {
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
    getIPv4RegExpString() {
        return '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\[?\\.]?){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    }
    getIPv4RegExp() {
        const ipv4 = this.getIPv4RegExpString();
        return new RegExp(ipv4, 'gi');
    }
    extractIPv4(s) {
        const regexp = this.getIPv4RegExp();
        return this.matchesWithRegExp(s, regexp);
    }
    _getIPv6RegExpString() {
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
    }
    getIPv6RegExp() {
        const ipv6 = this.getIPv6RegExpString();
        return new RegExp(ipv6, 'gi');
    }
    extractIPv6(s) {
        const regexp = this.getIPv6RegExp();
        return this.matchesWithRegExp(s, regexp);
    }
    getURLRegExp() {
        const domain = this.getDomainRegExpString();
        const ipv4 = this.getIPv4RegExpString();
        const url = `(?:${this.protocol})${this.auth}(?:${domain}|localhost|${ipv4})${this.port}${path}`;
        return new RegExp(url, 'gi');
    }
    getNonStrictURLRegExp() {
        const nonStrictDomain = this.getNonStrictDomainRegExpString();
        const ipv4 = this.getIPv4RegExpString();
        const nonStrictURL = `(?:${this.protocol})${this.auth}(?:${nonStrictDomain}|localhost|${ipv4})${this.port}${path}`;
        return new RegExp(nonStrictURL, 'gi');
    }
    getInternationalizedURLRegExp() {
        const internationalizedDomain = this.getInternationalizedDomainRegExpString();
        const ipv4 = this.getIPv4RegExpString();
        const internationalizedURL = `(?:${this.protocol})${this.auth}(?:${internationalizedDomain}|localhost|${ipv4})${this.port}${path}`;
        return new RegExp(internationalizedURL, 'gi');
    }
    getNonStrictInternationalizedURLRegExp() {
        const nonStrictInternationalizedDomain = this.getNonStrictInternationalizedDomainRegExpString();
        const ipv4 = this.getIPv4RegExpString();
        const nonStrictInternationalizedURL = `(?:${this.protocol})${this.auth}(?:${nonStrictInternationalizedDomain}|localhost|${ipv4})${this.port}${path}`;
        return new RegExp(nonStrictInternationalizedURL, 'gi');
    }
    extractURL(s, enableIDN = true, strictTLD = true) {
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
    getCVERegExp() {
        return;
    }
    extractCVE(s) {
        const regexp = /(CVE-(19|20)\d{2}-\d{4,7})/gi;
        return this.matchesWithRegExp(s, regexp);
    }
    getBTCRegExp() {
        return /\b[13][a-km-zA-HJ-NP-Z0-9]{26,33}\b/gi;
    }
    extractBTC(s) {
        const regexp = this.getBTCRegExp();
        return this.matchesWithRegExp(s, regexp);
    }
    getXMRRegExp() {
        return /\b4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}\b/gi;
    }
    extractXMR(s) {
        const regexp = this.getXMRRegExp();
        return this.matchesWithRegExp(s, regexp);
    }
    getGAPubIDRegExp() {
        return /pub-\d{16}/gi;
    }
    extractGAPubID(s) {
        const regexp = this.getGAPubIDRegExp();
        return this.matchesWithRegExp(s, regexp);
    }
    getGATrackIDRegExp() {
        return /UA-\d{4,9}(-\d{1,2})?/gi;
    }
    extractGATrackID(s) {
        const regexp = this.getGATrackIDRegExp();
        return this.matchesWithRegExp(s, regexp);
    }
    getMACAddressRegExp() {
        return /\b(?:[A-Fa-f0-9]{2}([-:]))(?:[A-Fa-f0-9]{2}\1){4}[A-Fa-f0-9]{2}\b/gi;
    }
    extractMacAddress(s) {
        const regexp = this.getMACAddressRegExp();
        return this.matchesWithRegExp(s, regexp);
    }
    getETHRegExp() {
        return /\b0x[a-fA-F0-9]{40}\b/gi;
    }
    extractETH(s) {
        const regexp = this.getETHRegExp();
        return this.matchesWithRegExp(s, regexp);
    }
    getFilePathRegExp() {
        return /(?:[a-zA-Z]:|\\\\[a-z0-9_.$\●-]+\\[a-z0-9_.$\●-]+)\\.+?(?=\.[a-zA-Z]|).+?\s/g;
    }
    extractFilePath(s) {
        const regexp = this.getFilePathRegExp();
        return this.matchesWithRegExp(s, regexp);
    }
    getDateRegExp() {
        return /[0123][0,1]?\d{1}[\/\.\\\-](([0-2]?\d{1})|([3][0,1]{1}))[\/\.\\\-](([1]{1}[9]{1}[9]{1}\d{1})|([2-9]{1}\d{3}))/g;
    }
    extractDate(s) {
        const regexp = this.getDateRegExp();
        return this.matchesWithRegExp(s, regexp);
    }
    extractFileWithExtension(s) {
        const regexp = /[^\s\/\\]+\.(?:(?:[dD][oO][cC][xX]?)|(?:[pP][dD][fF])|(?:[eE][xX][eE])|(?:[dD][lL][lL])|(?:[pP][dD][bB])|(?:[sS][cC][rR])|(?:[vV][bB][sS])|(?:[rR][tT][fF])|(?:[xX][lL][sS])|(?:[jJ][pP][gG])|(?:[zZ][iI][pP]))/g;
        return this.matchesWithRegExp(s, regexp);
    }
    extractCWE(s) {
        const regexp = /(CVE-(19|20)\d{2}-\d{4,7})/gi;
        return this.matchesWithRegExp(s, regexp);
    }
    extractRegistry(s) {
        const regexp = /(HKEY_LOCAL_MACHINE\\|HKLM\\)([a-zA-Z0-9\s_@\-\^!#.\:\/\$%&+={}\[\]\\*])+(?<!\S)/gim;
        return this.matchesWithRegExp(s, regexp);
    }
    extractElementsFromString(arr, input) {
        let out = null;
        arr.map((el) => {
            input.includes(el) && arr.indexOf(el) === 0 ? out.push(el) : null;
        });
        return out;
    }
    threatFieldExtractor(callback, threatField, input, additional = undefined) {
        let extract = additional !== undefined ? callback(additional, input) : callback(input);
        if (extract !== null)
            threatField.push({
                parameter: extract.join(' '),
                info: input,
            });
    }
    iocFieldExtractor(callback, iocField, input, paragraph, danger) {
        let extract = callback(input);
        if (extract !== null)
            iocField.push({
                parameter: extract.join(' '),
                info: paragraph,
                dangerous: danger,
            });
    }
    parse(inputString, fileName) {
        const threat = {
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
                url: [],
            },
            document: '',
            rating: '',
            comment: '',
        };
        threat.document = this.formatString(inputString);
        this.splitToParagraphs(threat.document).map((paragraph) => {
            this.threatFieldExtractor(this.extractElementsFromString, threat.threatActor, paragraph, threatGroupID_1.threatGroup);
            this.threatFieldExtractor(this.extractElementsFromString, threat.industry, paragraph, industries_1.industries);
            this.threatFieldExtractor(this.extractCVE.bind(this), threat.cve, paragraph);
            this.threatFieldExtractor(this.extractCWE.bind(this), threat.cwe, paragraph);
            let keywordConnections = this.extractElementsFromString(keywords_1.keywords, paragraph);
            if (keywordConnections !== []) {
                this.splitToSentencies(paragraph).map((sentence) => {
                    this.iocFieldExtractor(this.extractURL.bind(this), threat.ioc.url, sentence, paragraph, true);
                    this.iocFieldExtractor(this.extractDomain.bind(this), threat.ioc.domain, sentence, paragraph, true);
                    this.iocFieldExtractor(this.extractIPv4.bind(this), threat.ioc.ipv4, sentence, paragraph, true);
                    this.iocFieldExtractor(this.extractIPv6.bind(this), threat.ioc.ipv6, sentence, paragraph, true);
                    this.iocFieldExtractor(this.extractEmail.bind(this), threat.ioc.email, sentence, paragraph, true);
                    this.iocFieldExtractor(this.extractRegistry.bind(this), threat.ioc.registryKey, sentence, paragraph, true);
                    this.iocFieldExtractor(this.extractMD5.bind(this), threat.ioc.md5, sentence, paragraph, true);
                    this.iocFieldExtractor(this.extractSHA1.bind(this), threat.ioc.sha1, sentence, paragraph, true);
                    this.iocFieldExtractor(this.extractSHA256.bind(this), threat.ioc.sha256, sentence, paragraph, true);
                    this.iocFieldExtractor(this.extractSHA512.bind(this), threat.ioc.sha512, sentence, paragraph, true);
                    this.iocFieldExtractor(this.extractSSDEEP.bind(this), threat.ioc.ssdeep, sentence, paragraph, true);
                    this.threatFieldExtractor(this.extractDate.bind(this), threat.timeStamp, paragraph);
                });
            }
            else {
                this.splitToSentencies(paragraph).map((sentence) => {
                    this.iocFieldExtractor(this.extractURL.bind(this), threat.ioc.url, sentence, paragraph, false);
                    this.iocFieldExtractor(this.extractDomain.bind(this), threat.ioc.domain, sentence, paragraph, false);
                    this.iocFieldExtractor(this.extractIPv4.bind(this), threat.ioc.ipv4, sentence, paragraph, false);
                    this.iocFieldExtractor(this.extractIPv6.bind(this), threat.ioc.ipv6, sentence, paragraph, false);
                    this.iocFieldExtractor(this.extractEmail.bind(this), threat.ioc.email, sentence, paragraph, false);
                    this.iocFieldExtractor(this.extractRegistry.bind(this), threat.ioc.registryKey, sentence, paragraph, false);
                    this.iocFieldExtractor(this.extractMD5.bind(this), threat.ioc.md5, sentence, paragraph, false);
                    this.iocFieldExtractor(this.extractSHA1.bind(this), threat.ioc.sha1, sentence, paragraph, false);
                    this.iocFieldExtractor(this.extractSHA256.bind(this), threat.ioc.sha256, sentence, paragraph, false);
                    this.iocFieldExtractor(this.extractSHA512.bind(this), threat.ioc.sha512, sentence, paragraph, false);
                    this.iocFieldExtractor(this.extractSSDEEP.bind(this), threat.ioc.ssdeep, sentence, paragraph, false);
                    this.threatFieldExtractor(this.extractDate.bind(this), threat.timeStamp, paragraph);
                });
            }
        });
        console.log(JSON.stringify(threat));
        this.threats.push(threat);
        return threat;
    }
};
ThreatLogic = __decorate([
    common_1.Injectable()
], ThreatLogic);
exports.ThreatLogic = ThreatLogic;
//# sourceMappingURL=threat.logic.js.map