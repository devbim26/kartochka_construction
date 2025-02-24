export enum IndexType {
	Rw = 'Rw',
	Lnw = 'Lnw',
	ValueΔRw = 'ΔRw',
}

export const RuIndexTypeNamesSelectValues = [
	{ label: 'Rw', value: IndexType.Rw },
	{ label: 'Lnw', value: IndexType.Lnw },
	{ label: 'ΔRw', value: IndexType.ValueΔRw },
];
