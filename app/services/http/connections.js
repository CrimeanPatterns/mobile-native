import API from '../api';

export default {
    /**
     * Get list of connected members
     *
     * @returns {AxiosPromise<any>}
     */
    get() {
        return API.get(`/connections/`);
    },
    /**
     * Approve user connection
     *
     * @param {number} connectionId - connection id
     * @returns {AxiosPromise<any>}
     */
    approve(connectionId) {
        return API.post(`/connections/approve/${connectionId}`);
    },
    /**
     * Grant user access
     *
     * @param {integer} connectionId - connection id
     * @param {('full'|'readonly'|'never-show')} grantType - grant access type
     * @returns {AxiosPromise<any>}
     */
    grant(connectionId, grantType) {
        return API.post(`/connections/members/grant-access/${connectionId}/${grantType}`);
    },
    /**
     * Share accounts with user
     *
     * @param {string} shareCode - share code
     * @returns {AxiosPromise<any>}
     */
    share(shareCode) {
        return API.post(`/connections/share/${shareCode}`);
    },
    /**
     * Deny access to all accounts
     *
     * @param {integer} connectionId - connection id
     * @returns {AxiosPromise<any>}
     */
    denyAll(connectionId) {
        return API.post(`/connections/share/deny-all/${connectionId}`);
    },
    /**
     * Remove connection with user, if it is FM then FM will be deleted
     *
     * @param {integer} connectionId - connection id
     * @returns {AxiosPromise<any>}
     */
    removeConnection(connectionId) {
        return API.delete(`/connections/${connectionId}`);
    },
    /**
     * Invite user or connect to existing user
     *
     * @param {string} email - user email
     * @returns {AxiosPromise<any>}
     */
    invite(email) {
        return API.post(`/agent/add-connection`, {email});
    },
    /**
     * Get info about invite
     *
     * @param {string} shareCode - Share code
     * @returns {AxiosPromise<any>}
     */
    getInviteInfo(shareCode) {
        return API.get(`/connections/invite/confirm/${shareCode}`);
    },
    /**
     * Accept user invite
     *
     * @param {string} shareCode - Share code
     * @returns {AxiosPromise<any>}
     */
    acceptInvite(shareCode) {
        return API.post(`/connections/invite/confirm/${shareCode}`);
    },
    /**
     * Remove invite
     *
     * @param {integer} inviteId - invite id
     * @returns {AxiosPromise<any>}
     */
    removeInvite(inviteId) {
        return API.delete(`/connections/invite/${inviteId}`);
    },
    /**
     * Invite family member
     *
     * @param {integer} connectionId - connectionId
     * @param {string} email - user email
     * @returns {AxiosPromise<any>}
     */
    inviteFamilyMember(connectionId, email) {
        return API.post(`/connections/family-member/invite/${connectionId}`, {email});
    },
    /**
     * Send reminder for invited user
     *
     * @param {integer} inviteId - invite id
     * @param {('invite'|'connected_user')} connectionType - type of connection
     * @returns {AxiosPromise<any>}
     */
    resendInvite(inviteId, connectionType) {
        if (connectionType === 'invite') {
            return API.post(`/connections/invite/reminder/${inviteId}`);
        }

        return API.post(`/connections/reminder/${inviteId}`);
    },
    /**
     * Reject invite
     *
     * @param {string} shareCode - Share Code
     * @returns {AxiosPromise<any>}
     */
    rejectInvite(shareCode) {
        return API.post(`/connections/invite/reject/${shareCode}`);
    },
    /**
     * Get form of family-member|connection
     *
     * @param {integer} connectionId - connection id
     * @returns {AxiosPromise<any>}
     */
    getForm(connectionId) {
        return API.get(`/connections/${connectionId}`);
    },
    /**
     * Save form of family-member|connection
     *
     * @param {integer} connectionId - connection id
     * @param {object} data - form data
     * @returns {AxiosPromise<any>}
     */
    saveForm(connectionId, data) {
        return API.put(`/connections/${connectionId}`, data);
    },
};
