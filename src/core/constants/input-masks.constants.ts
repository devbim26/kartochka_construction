export const phoneNumberMask = {
	mask: '+375 (__) ___-__-__',
	replacement: { _: /\d/ },
	showMask: true,
};

export const approvalCodeMask = {
	mask: '_-_-_-_',
	replacement: { _: /\d/ },
	showMask: true,
};
