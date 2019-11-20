export interface ILogger {
    setPrefix(prefix: string): void;
    info(...args: any[]): void;
    verbose(...args: any[]): void;
    debug(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
}