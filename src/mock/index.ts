import { mock } from './MockAdapter'
import './fakeApi/authFakeApi'
import './fakeApi/commonFakeApi'
import './fakeApi/menuFakeApi'
import './fakeApi/itemsFakeApi'
import './fakeApi/categoryFakeApi'
import './fakeApi/outletsFakeApi'
import './fakeApi/accountsFakeApi'

mock.onAny().passThrough()
