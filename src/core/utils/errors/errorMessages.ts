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

export const getErrorMessage = (type: ErrorType, value?: string) => {
	switch (type) {
		case 'maxLength':
			return `Количество символов должно быть меньше ${value ?? ''}`;
		case 'negativeSum':
			return 'Число должно быть положительным';
		case 'required':
			return 'Обязательно для заполнения';
		case 'incorrectPasswordSymbols':
			return 'Пароль должен содержать минимум 1 цифру, специальный символ, маленькую и большую буквы';
		case 'email':
			return 'Некорректный email';
		case 'regex':
			return `Значение должно удовлетворять шаблону${value ? ': ' + value : ''}`;
		case 'minLength':
			return `Количество символов должно быть больше ${value ?? ''}`;
		case 'incorrectNumber':
			return `Неверный номер телефона`;
		case 'requiredSelectElement':
			return 'Выберите хотя-бы один элемент из списка';
		case 'incorrectDataFormat':
			return 'Неверный формат даты';
		case 'fileWasNotChosen':
			return 'Файл не выбран';
		default:
			return 'Что-то пошло не так...';
	}
};
