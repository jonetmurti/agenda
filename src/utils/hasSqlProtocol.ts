const sqlProtocols = ['mysql', 'postgres', 'postgresql'];
export const hasSqlProtocol = (url: string): boolean =>
	sqlProtocols.some(scheme => url.startsWith(scheme));
