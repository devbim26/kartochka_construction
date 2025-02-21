export enum RoomType {
	Room = 'Room',
	Kitchen = 'Kitchen',
	Stairwell = 'Stairwell',
	Hall = 'Hall',
	Corridor = 'Corridor',
	Lobby = 'Lobby',
	DiningRoom = 'DiningRoom',
	Restaurant = 'Restaurant',
	SportsHall = 'SportsHall',
}

export const RuRoomTypeSelectValues = [
	{ label: 'Комната', value: RoomType.Room },
	{ label: 'Кухня', value: RoomType.Kitchen },
	{ label: 'Лестничная клетка', value: RoomType.Stairwell },
	{ label: 'Холл', value: RoomType.Hall },
	{ label: 'Коридор', value: RoomType.Corridor },
	{ label: 'Вестибюль', value: RoomType.Lobby },
	{ label: 'Столовая', value: RoomType.DiningRoom },
	{ label: 'Ресторан', value: RoomType.Restaurant },
	{ label: 'Спортивный зал', value: RoomType.SportsHall },
];

export const RuRoomTypeNamesMap = {
	[RoomType.Room]: 'Комната',
	[RoomType.Kitchen]: 'Кухня',
	[RoomType.Stairwell]: 'Лестничная клетка',
	[RoomType.Hall]: 'Холл',
	[RoomType.Corridor]: 'Коридор',
	[RoomType.Lobby]: 'Вестибюль',
	[RoomType.DiningRoom]: 'Столовая',
	[RoomType.Restaurant]: 'Ресторан',
	[RoomType.SportsHall]: 'Спортивный зал',
};
