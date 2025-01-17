import { DevScreen } from '../../../dev';
import { MaterialsPage } from '../../presentation';

export const GUIDBOOKS_ROUTES = {
	materials: {
		id: 'materials-page-id',
		route: 'materials',
		element: <MaterialsPage />,
	},
	constructions: {
		id: 'constructions-page-id',
		route: 'constructions',
		element: <DevScreen title="Справочники. Конструкции" />,
	},
	requirements: {
		id: 'requirements-page-id',
		route: 'requirements',
		element: <DevScreen title="Справочники. Требования" />,
	},
	issuers: {
		id: 'issuers-page-id',
		route: 'issuers',
		element: <DevScreen title="Справочники. Производители" />,
	},
};
