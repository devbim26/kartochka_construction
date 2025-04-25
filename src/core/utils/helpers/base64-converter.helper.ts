export const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
};

export const convertBase64ToFile = (base64: string, fileName: string, mimeType: string): File => {
	const byteCharacters = atob(base64.split(',')[1]);
	const byteNumbers = new Array(byteCharacters.length)
		.fill(0)
		.map((_, i) => byteCharacters.charCodeAt(i));
	const byteArray = new Uint8Array(byteNumbers);
	const blob = new Blob([byteArray], { type: mimeType });

	return new File([blob], fileName, { type: mimeType });
};
