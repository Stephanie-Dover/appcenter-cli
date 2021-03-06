/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

const models = require('./index');

/**
 * Apple notification certificate configuration.
 *
 * @extends models['NotificationConfig']
 */
class NotificationConfigApple extends models['NotificationConfig'] {
  /**
   * Create a NotificationConfigApple.
   * @property {string} endpointType Possible values include: 'production',
   * 'sandbox'
   * @property {string} certEncoded Base64 encoded certificate string.
   * @property {string} certFilename Certificate file name
   * @property {string} certKey Certificate password
   */
  constructor() {
    super();
  }

  /**
   * Defines the metadata of NotificationConfigApple
   *
   * @returns {object} metadata of NotificationConfigApple
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'apns_config',
      type: {
        name: 'Composite',
        polymorphicDiscriminator: {
          serializedName: 'type',
          clientName: 'type'
        },
        uberParent: 'NotificationConfig',
        className: 'NotificationConfigApple',
        modelProperties: {
          type: {
            required: true,
            serializedName: 'type',
            isPolymorphicDiscriminator: true,
            type: {
              name: 'String'
            }
          },
          endpointType: {
            required: true,
            serializedName: 'endpoint_type',
            type: {
              name: 'String'
            }
          },
          certEncoded: {
            required: true,
            serializedName: 'cert_encoded',
            type: {
              name: 'String'
            }
          },
          certFilename: {
            required: true,
            serializedName: 'cert_filename',
            type: {
              name: 'String'
            }
          },
          certKey: {
            required: true,
            serializedName: 'cert_key',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = NotificationConfigApple;
