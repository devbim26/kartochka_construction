export type ErrorType =
	| 'maxLength'
	| 'negativeSum'
	| 'required'
	| 'email'
	| 'regex'
	| 'minLength'
	| 'incorrectPasswordSymbols'
	| 'incorrectNumber'
	| 'incorrectDataFormat'
	| 'requiredSelectElement'
	| 'fileWasNotChosen';

const errorMessageMap = new Map<string, (prop?: any) => string>([
	['maxLength', (prop?: any) => `Количество символов должно быть меньше ${prop ?? ''}`],
	['negativeSum', (prop?: any) => 'Число должно быть положительным'],
	['required', (prop?: any) => 'Обязательно для заполнения'],
	['email', (prop?: any) => 'Некорректный email'],
	['regex', (prop?: any) => `Значение должно удовлетворять шаблону${prop ? ': ' + prop : ''}`],
	['minLength', (prop?: any) => `Количество символов должно быть больше ${prop ?? ''}`],
	[
		'incorrectPasswordSymbols',
		(prop?: any) =>
			'Пароль должен содержать минимум 1 цифру, специальный символ, маленькую и большую буквы',
	],
	['incorrectNumber', (prop?: any) => 'Неверный номер телефона'],
	['incorrectDataFormat', (prop?: any) => 'Неверный формат даты'],
	['requiredSelectElement', (prop?: any) => 'Выберите хотя-бы один элемент из списка'],
	['fileWasNotChosen', (prop?: any) => 'Файл не выбран'],
]);

export const getErrorMessage = (type: ErrorType, value?: string) => {
	if (errorMessageMap.has(type)) {
		return errorMessageMap.get(type)!(value);
	} else {
		return 'Что-то пошло не так...';
	}
};
