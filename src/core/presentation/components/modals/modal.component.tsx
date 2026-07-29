import type { MotionProps } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5';
import { twMerge } from 'tailwind-merge';
import { Separator } from '../separator';

export interface ModalProps extends PropsWithChildren<MotionProps> {
	headerTitle: string;
	isOpen: boolean;
	onClose: () => void;
	Footer?: () => React.JSX.Element;
	className?: string;
	contentClassName?: string;
	HeaderButton?: React.JSX.Element;
}

export const Modal = ({
	isOpen,
	headerTitle,
	HeaderButton,
	Footer,
	onClose,
	children,
	className,
	contentClassName,
	...props
}: ModalProps) => {
	if (typeof document === 'undefined') return null;

	return createPortal(
		<>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: 0.2,
							ease: 'easeIn',
						}}
						onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
						key="modal-root"
						className="fixed inset-0 z-20 bg-black/40 transition-opacity"
						{...props}
					/>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{isOpen && (
					<div className="fixed inset-0 z-30 flex items-center justify-center">
						<motion.div
							id="modal-content"
							className={twMerge(
								'relative flex transform flex-col rounded-xl bg-white shadow',
								'max-h-[98%] w-[90%] min-w-72 max-w-5xl md:w-[40rem]',
								className,
							)}
							initial={{ y: 50, scale: 0.95, opacity: 0.5 }}
							animate={{ y: 0, scale: 1, opacity: 1 }}
							exit={{ y: 50, scale: 0.95, opacity: 0 }}
							key="modal-content"
						>
							<div className="flex justify-between px-4 py-3">
								<p className="font-sans text-lg font-semibold">{headerTitle}</p>
								<div
									className={twMerge(
										Boolean(HeaderButton) &&
											'flex items-center justify-center gap-1',
									)}
								>
									{HeaderButton}
									<IoCloseOutline
										className="ml-2 size-6 shrink-0 cursor-pointer"
										onClick={onClose}
									/>
								</div>
							</div>
							<Separator />
							<div
								id="modal-body"
								className={twMerge(
									'p-semibold-16 flex max-h-[80vh] w-full min-w-0 flex-col overflow-auto rounded-xl bg-white p-4 px-6 py-4',
									contentClassName,
								)}
							>
								{children}
							</div>
							{Footer && <Footer />}
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>,
		document.body,
	);
};
