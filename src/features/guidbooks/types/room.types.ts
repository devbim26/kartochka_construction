export enum RoomType {
	Room = 'Room',
	Kitchen = 'Kitchen',
}

export const RuRoomTypeSelectValues = [
	{ label: 'Комната', value: RoomType.Room },
	{ label: 'Кухня', value: RoomType.Kitchen },
];

export const RuRoomTypeNamesMap = {
	[RoomType.Room]: 'Комната',
	[RoomType.Kitchen]: 'Ключи',
};
