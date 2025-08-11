import { set } from './core/store.js';
import { seedDemo } from './data/demo-seed.js';
import * as TopBar from './features/layout/topbar.js';
import * as LeftRail from './features/layout/leftrail.js';
import * as RightRail from './features/layout/rightrail.js';
import * as BottomBar from './features/layout/bottombar.js';
import * as Workspace from './features/layout/workspace.js';

set('viewerLocale', 'en');
set('clock', { now: new Date('2400-01-01T00:00:00Z'), speed: 'paused' });
set('modals', []);

seedDemo();

TopBar.init();
LeftRail.init();
RightRail.init();
BottomBar.init();
Workspace.init();
