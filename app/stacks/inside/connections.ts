import React from 'react';

import {ConnectionsScreen} from '../../screens/connections';
import AgentAddScreen from '../../screens/connections/add';
import ConnectionEditScreen from '../../screens/connections/connection/edit';
import ConnectionGrantAccessScreen from '../../screens/connections/connection/grantAccess';
import ConnectionInviteScreen from '../../screens/connections/connection/invite';
import ConnectionShareScreen from '../../screens/connections/connection/share';
import {ConnectionsRoutes} from '../../types/navigation';

export const ConnectionsScreens: {
    name: keyof ConnectionsRoutes;
    component: React.ComponentType;
}[] = [
    {name: 'Connections', component: ConnectionsScreen},
    {name: 'ConnectionEdit', component: ConnectionEditScreen},
    {name: 'ConnectionGrantAccess', component: ConnectionGrantAccessScreen},
    {name: 'ConnectionShare', component: ConnectionShareScreen},
    {name: 'ConnectionInvite', component: ConnectionInviteScreen},
    {name: 'AgentAdd', component: AgentAddScreen},
];
