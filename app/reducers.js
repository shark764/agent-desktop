import { combineReducers } from 'redux-immutable';
import language from 'containers/LanguageProvider/reducer';
import login from 'containers/Login/reducer';
import agentDesktop from 'containers/AgentDesktop/reducer';
import toolbar from 'containers/Toolbar/reducer';
import sidePanel from 'containers/SidePanel/reducer';
import interactionsBar from 'containers/InteractionsBar/reducer';
import infoTab from 'containers/InfoTab/reducer';
import contactsControl from 'containers/ContactsControl/reducer';
import errors from 'containers/Errors/reducer';

export default combineReducers({
  language,
  login,
  agentDesktop,
  toolbar,
  sidePanel,
  interactionsBar,
  infoTab,
  contactsControl,
  errors,
});
