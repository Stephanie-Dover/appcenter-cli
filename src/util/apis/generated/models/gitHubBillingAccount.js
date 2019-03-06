/*
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

/**
 * App Center account details from GitHub billing
 *
 */
class GitHubBillingAccount {
  /**
   * Create a GitHubBillingAccount.
   * @member {string} id The unique id (UUID) of the account
   * @member {string} displayName The account's display name
   * @member {string} name The unique name that used to identify the owner
   * @member {string} type The owner type. Can either be 'org' or 'user'.
   * Possible values include: 'org', 'user'
   */
  constructor() {
  }

  /**
   * Defines the metadata of GitHubBillingAccount
   *
   * @returns {object} metadata of GitHubBillingAccount
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'GitHubBillingAccount',
      type: {
        name: 'Composite',
        className: 'GitHubBillingAccount',
        modelProperties: {
          id: {
            required: true,
            serializedName: 'id',
            type: {
              name: 'String'
            }
          },
          displayName: {
            required: true,
            serializedName: 'display_name',
            type: {
              name: 'String'
            }
          },
          name: {
            required: true,
            serializedName: 'name',
            type: {
              name: 'String'
            }
          },
          type: {
            required: true,
            serializedName: 'type',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = GitHubBillingAccount;