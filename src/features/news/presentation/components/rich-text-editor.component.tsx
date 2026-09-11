import { FormElementLabel, useI18n } from '@core';
import { useEffect, useRef } from 'react';
import {
	MdFormatBold,
	MdFormatItalic,
	MdFormatListBulleted,
	MdFormatListNumbered,
	MdFormatQuote,
	MdFormatStrikethrough,
	MdTitle,
} from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { isRichTextEmpty } from '../../utils/html-text.utils';

type RichTextEditorProps = {
	value?: string;
	onChange: (html: string) => void;
	onBlur?: () => void;
	label?: string;
	error?: string;
	placeholder?: string;
	className?: string;
};

type ToolbarButtonProps = {
	active?: boolean;
	onClick: () => void;
	title: string;
	children: React.ReactNode;
};

const ToolbarButton = ({ active, onClick, title, children }: ToolbarButtonProps) => (
	<button
		type="button"
		title={title}
		onMouseDown={(event) => {
			event.preventDefault();
			onClick();
		}}
		className={twMerge(
			'inline-flex size-8 items-center justify-center rounded-md border border-transparent text-gray-700 transition-colors hover:bg-gray-100',
			active && 'border-primary/30 bg-primary/10 text-primary',
		)}
	>
		{children}
	</button>
);

const normalizeHtml = (html?: string | null): string => {
	if (!html || isRichTextEmpty(html)) return '';
	return html;
};

export const RichTextEditor = ({
	value = '',
	onChange,
	onBlur,
	label,
	error,
	placeholder,
	className,
}: RichTextEditorProps) => {
	const { locale } = useI18n();
	const editorRef = useRef<HTMLDivElement>(null);
	const lastEmittedRef = useRef(normalizeHtml(value));

	useEffect(() => {
		const el = editorRef.current;
		if (!el) return;
		const next = normalizeHtml(value);
		if (normalizeHtml(el.innerHTML) === next) return;
		el.innerHTML = next;
		lastEmittedRef.current = next;
	}, [value]);

	const emitChange = () => {
		const el = editorRef.current;
		if (!el) return;
		const html = normalizeHtml(el.innerHTML);
		if (html === lastEmittedRef.current) return;
		lastEmittedRef.current = html;
		onChange(html);
	};

	const runCommand = (command: string, commandValue?: string) => {
		editorRef.current?.focus();
		document.execCommand(command, false, commandValue);
		emitChange();
	};

	const boldTitle = locale === 'ru' ? 'Жирный' : 'Bold';
	const italicTitle = locale === 'ru' ? 'Курсив' : 'Italic';
	const strikeTitle = locale === 'ru' ? 'Зачёркнутый' : 'Strikethrough';
	const h2Title = locale === 'ru' ? 'Подзаголовок' : 'Heading';
	const bulletTitle = locale === 'ru' ? 'Маркированный список' : 'Bullet list';
	const orderedTitle = locale === 'ru' ? 'Нумерованный список' : 'Ordered list';
	const quoteTitle = locale === 'ru' ? 'Цитата' : 'Quote';

	return (
		<div className={twMerge('flex w-full flex-col gap-2', className)}>
			{label ? (
				<FormElementLabel
					className={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
						error ? 'text-error' : '',
					)}
					errorMessage={error}
				>
					{label}
				</FormElementLabel>
			) : null}
			<div
				className={twMerge(
					'overflow-hidden rounded-[8px] bg-white ring-1 ring-inset ring-input-border-primary',
					error && 'ring-error',
				)}
			>
				<div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
					<ToolbarButton title={boldTitle} onClick={() => runCommand('bold')}>
						<MdFormatBold className="size-5" />
					</ToolbarButton>
					<ToolbarButton title={italicTitle} onClick={() => runCommand('italic')}>
						<MdFormatItalic className="size-5" />
					</ToolbarButton>
					<ToolbarButton title={strikeTitle} onClick={() => runCommand('strikeThrough')}>
						<MdFormatStrikethrough className="size-5" />
					</ToolbarButton>
					<span className="mx-1 h-5 w-px bg-gray-200" />
					<ToolbarButton title={h2Title} onClick={() => runCommand('formatBlock', 'h2')}>
						<MdTitle className="size-5" />
					</ToolbarButton>
					<ToolbarButton
						title={bulletTitle}
						onClick={() => runCommand('insertUnorderedList')}
					>
						<MdFormatListBulleted className="size-5" />
					</ToolbarButton>
					<ToolbarButton
						title={orderedTitle}
						onClick={() => runCommand('insertOrderedList')}
					>
						<MdFormatListNumbered className="size-5" />
					</ToolbarButton>
					<ToolbarButton
						title={quoteTitle}
						onClick={() => runCommand('formatBlock', 'blockquote')}
					>
						<MdFormatQuote className="size-5" />
					</ToolbarButton>
				</div>
				<div
					ref={editorRef}
					className="news-rich-editor min-h-[180px] max-h-[420px] overflow-y-auto px-3 py-2 font-sans text-sm leading-6 text-black outline-none"
					contentEditable
					suppressContentEditableWarning
					data-placeholder={placeholder}
					role="textbox"
					aria-multiline
					onInput={emitChange}
					onBlur={() => {
						emitChange();
						onBlur?.();
					}}
				/>
			</div>
		</div>
	);
};
