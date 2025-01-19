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
	['negativeSum', () => 'Число должно быть положительным'],
	['required', () => 'Обязательно для заполнения'],
	['email', () => 'Некорректный email'],
	['regex', (prop?: any) => `Значение должно удовлетворять шаблону${prop ? ': ' + prop : ''}`],
	['minLength', (prop?: any) => `Количество символов должно быть больше ${prop ?? ''}`],
	[
		'incorrectPasswordSymbols',
		() =>
			'Пароль должен содержать минимум 1 цифру, специальный символ, маленькую и большую буквы',
	],
	['incorrectNumber', () => 'Неверный номер телефона'],
	['incorrectDataFormat', () => 'Неверный формат даты'],
	['requiredSelectElement', () => 'Выберите хотя-бы один элемент из списка'],
	['fileWasNotChosen', () => 'Файл не выбран'],
]);

export const getErrorMessage = (type: ErrorType, value?: string) => {
	if (errorMessageMap.has(type)) {
		return errorMessageMap.get(type)!(value);
	} else {
		return 'Что-то пошло не так...';
	}
};
