/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentDesktop constants
 *
 */

export const SET_USER_CONFIG = 'app/AgentDesktop/SET_USER_CONFIG';
export const SET_EXTENSIONS = 'app/AgentDesktop/SET_EXTENSIONS';
export const SET_ACTIVE_EXTENSION = 'app/AgentDesktop/SET_ACTIVE_EXTENSION';
export const REMOVE_INVALID_EXTENSION = 'app/AgentDesktop/REMOVE_INVALID_EXTENSION';
export const SET_QUEUES = 'app/AgentDesktop/SET_QUEUES';
export const SET_QUEUE_TIME = 'app/AgentDesktop/SET_QUEUE_TIME';
export const SET_PRESENCE = 'app/AgentDesktop/SET_PRESENCE';
export const GO_NOT_READY = 'app/AgentDesktop/GO_NOT_READY';
export const UPDATE_WRAPUP_DETAILS = 'app/AgentDesktop/UPDATE_WRAPUP_DETAILS';
export const ADD_SCRIPT = 'app/AgentDesktop/ADD_SCRIPT';
export const REMOVE_SCRIPT = 'app/AgentDesktop/REMOVE_SCRIPT';
export const SET_INTERACTION_STATUS = 'app/AgentDesktop/SET_INTERACTION_STATUS';
export const OPEN_NEW_INTERACTION_PANEL = 'app/AgentDesktop/OPEN_NEW_INTERACTION_PANEL';
export const NEW_INTERACTION_PANEL_SELECT_CONTACT = 'app/AgentDesktop/NEW_INTERACTION_PANEL_SELECT_CONTACT';
export const CLOSE_NEW_INTERACTION_PANEL = 'app/AgentDesktop/CLOSE_NEW_INTERACTION_PANEL';
export const START_OUTBOUND_INTERACTION = 'app/AgentDesktop/START_OUTBOUND_INTERACTION';
export const CANCEL_CLICK_TO_DIAL = 'app/AgentDesktop/CANCEL_CLICK_TO_DIAL';
export const SET_IS_CANCELLING_INTERACTION = 'app/AgentDesktop/SET_IS_CANCELLING_INTERACTION';
export const INITIALIZE_OUTBOUND_SMS = 'app/AgentDesktop/INITIALIZE_OUTBOUND_SMS';
export const ADD_INTERACTION = 'app/AgentDesktop/ADD_INTERACTION';
export const WORK_INITIATED = 'app/AgentDesktop/WORK_INITIATED';
export const REMOVE_INTERACTION = 'app/AgentDesktop/REMOVE_INTERACTION';
export const SET_INTERACTION_QUERY = 'app/AgentDesktop/SET_INTERACTION_QUERY';
export const ADD_SEARCH_FILTER = 'app/AgentDesktop/ADD_SEARCH_FILTER';
export const REMOVE_SEARCH_FILTER = 'app/AgentDesktop/REMOVE_SEARCH_FILTER';
export const SET_MESSAGE_HISTORY = 'app/AgentDesktop/SET_MESSAGE_HISTORY';
export const SET_CONTACT_MODE = 'app/AgentDesktop/SET_CONTACT_MODE';
export const SET_ASSIGNED_CONTACT = 'app/AgentDesktop/SET_ASSIGNED_CONTACT';
export const ASSIGN_CONTACT = 'app/AgentDesktop/ASSIGN_CONTACT';
export const SET_SIDE_PANEL_TAB_INDEX = 'app/AgentDesktop/SET_SIDE_PANEL_TAB_INDEX';
export const LOAD_CONTACT_INTERACTION_HISTORY = 'app/AgentDesktop/LOAD_CONTACT_INTERACTION_HISTORY';
export const SET_CONTACT_INTERACTION_HISTORY = 'app/AgentDesktop/SET_CONTACT_INTERACTION_HISTORY';
export const SET_CONTACT_HISTORY_INTERACTION_DETAILS_LOADING = 'app/AgentDesktop/SET_CONTACT_HISTORY_INTERACTION_DETAILS_LOADING';
export const SET_CONTACT_HISTORY_INTERACTION_DETAILS = 'app/AgentDesktop/SET_CONTACT_HISTORY_INTERACTION_DETAILS';
export const LOAD_HISTORICAL_INTERACTION_BODY = 'app/AgentDesktop/LOAD_HISTORICAL_INTERACTION_BODY';
export const UPDATE_CONTACT_HISTORY_INTERACTION_DETAILS = 'app/AgentDesktop/UPDATE_CONTACT_HISTORY_INTERACTION_DETAILS';
export const ADD_NOTES_TO_CONTACT_INTERACTION_HISTORY = 'app/AgentDesktop/ADD_NOTES_TO_CONTACT_INTERACTION_HISTORY';
export const UPDATE_CONTACT = 'app/AgentDesktop/UPDATE_CONTACT';
export const DELETE_CONTACTS = 'app/AgentDesktop/DELETE_CONTACTS';
export const SELECT_CONTACT = 'app/AgentDesktop/SELECT_CONTACT';
export const REMOVE_CONTACT = 'app/AgentDesktop/REMOVE_CONTACT';
export const ADD_MESSAGE = 'app/AgentDesktop/ADD_MESSAGE';
export const SELECT_INTERACTION = 'app/AgentDesktop/SELECT_INTERACTION';
export const SET_CUSTOM_FIELDS = 'app/AgentDesktop/SET_CUSTOM_FIELDS';
export const SET_EMAIL_PLAIN_BODY = 'app/AgentDesktop/SET_EMAIL_PLAIN_BODY';
export const SET_EMAIL_HTML_BODY = 'app/AgentDesktop/SET_EMAIL_HTML_BODY';
export const SET_EMAIL_DETAILS = 'app/AgentDesktop/SET_EMAIL_DETAILS';
export const SET_EMAIL_ATTACHMENT_URL = 'app/AgentDesktop/SET_EMAIL_ATTACHMENT_URL';
export const START_WARM_TRANSFERRING = 'app/AgentDesktop/START_WARM_TRANSFERRING';
export const TRANSFER_CANCELLED = 'app/AgentDesktop/TRANSFER_CANCELLED';
export const RESOURCE_ADDED = 'app/AgentDesktop/RESOURCE_ADDED';
export const UPDATE_RESOURCE_NAME = 'app/AgentDesktop/UPDATE_RESOURCE_NAME';
export const UPDATE_RESOURCE_STATUS = 'app/AgentDesktop/UPDATE_RESOURCE_STATUS';
export const HOLD_ME = 'app/AgentDesktop/HOLD_ME';
export const RESUME_ME = 'app/AgentDesktop/RESUME_ME';
export const RESOURCE_REMOVED = 'app/AgentDesktop/RESOURCE_REMOVED';
export const MUTE_CALL = 'app/AgentDesktop/MUTE_CALL';
export const UNMUTE_CALL = 'app/AgentDesktop/UNMUTE_CALL';
export const HOLD_CALL = 'app/AgentDesktop/HOLD_CALL';
export const RESUME_CALL = 'app/AgentDesktop/RESUME_CALL';
export const RECORD_CALL = 'app/AgentDesktop/RECORD_CALL';
export const STOP_RECORD_CALL = 'app/AgentDesktop/STOP_RECORD_CALL';
export const EMAIL_CREATE_REPLY = 'app/AgentDesktop/EMAIL_CREATE_REPLY';
export const EMAIL_ADD_ATTACHMENT = 'app/AgentDesktop/EMAIL_ADD_ATTACHMENT';
export const EMAIL_REMOVE_ATTACHMENT = 'app/AgentDesktop/EMAIL_REMOVE_ATTACHMENT';
export const EMAIL_UPDATE_REPLY = 'app/AgentDesktop/EMAIL_UPDATE_REPLY';
export const EMAIL_CANCEL_REPLY = 'app/AgentDesktop/EMAIL_CANCEL_REPLY';
export const EMAIL_SEND_REPLY = 'app/AgentDesktop/EMAIL_SEND_REPLY';
export const UPDATE_NOTE = 'app/AgentDesktop/UPDATE_NOTE';
export const UPDATE_SCRIPT_VALUES = 'app/AgentDesktop/UPDATE_SCRIPT_VALUES';
export const SET_DISPOSITION_DETAILS = 'app/AgentDesktop/SET_DISPOSITION_DETAILS';
export const SELECT_DISPOSITION = 'app/AgentDesktop/SELECT_DISPOSITION';
export const SHOW_REFRESH_NOTIF = 'app/AgentDesktop/SHOW_REFRESH_NOTIF';
export const SHOW_CONTACTS_PANEL = 'app/AgentDesktop/SHOW_CONTACTS_PANEL';
export const HIDE_CONTACTS_PANEL = 'app/AgentDesktop/HIDE_CONTACTS_PANEL';
export const SET_FORM_IS_DIRTY = 'app/ContactsControl/SET_FORM_IS_DIRTY';
export const SET_FORM_VALIDITY = 'app/ContactsControl/SET_FORM_VALIDITY';
export const SET_FORM_FIELD = 'app/ContactsControl/SET_FORM_FIELD';
export const SET_FORM_ERROR = 'app/ContactsControl/SET_FORM_ERROR';
export const SET_SHOW_ERROR = 'app/ContactsControl/SET_SHOW_ERROR';
export const SET_UNUSED_FIELD = 'app/ContactsControl/SET_UNUSED_FIELD';
export const SET_SELECTED_INDEX = 'app/ContactsControl/SET_SELECTED_INDEX';
export const SET_EDITING_CONTACTS = 'app/ContactsControl/SET_EDITING_CONTACTS';
export const SET_CONTACT_SAVE_LOADING = 'app/ContactsControl/SET_CONTACT_SAVE_LOADING';
export const INIT_FORM = 'app/ContactsControl/INIT_FORM';
export const RESET_FORM = 'app/ContactsControl/RESET_FORM';


export const DEFAULT_LOCALE = 'en-US';
