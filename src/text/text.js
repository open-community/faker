// ============================================================
// Import packages
import faker from 'faker';
import _ from 'lodash';
import { ResourceType, api } from '@open-community/service-tools';

// ============================================================
// Functions

function id() {
    return api.toApiId(
        ResourceType.TEXT,
        faker.random.uuid,
    );
}

/**
 * Generate a random text object
 * @param {boolean} includeId - If true, a generated id will also be included
 * @param {number} titleWordMax - Maximum number of words in the title.
 *                                The final result will have between 0 and titleWordsMax words
 * @param {number} paragraphMax - Maxmimum number of paragraphs in the text.
 *                                The final result will have between 0 and paragraphMax paragrpahs
 * @param {ResourceId[]} owners - List of owners. Each element will be used as a
 *                                ResourceId to build the final ApiId that
 *                                will be in the Text object
 * @param {Array.<{account: ResourceId, identity: ResourceId}>} authors - List of all auhtors
 */
function generate({
    includeId = true,
    titleWordMax = 10,
    paragraphMax = 3,
    owners = ['A'],
    authors = [{ account: 'A', identity: 'A' }],
    contexts = ['topic'],
} = {}) {
    const fake = {};

    /**
     * List of all accounts
     * @type {Object.<ApiId>}
     */
    const accounts = {};

    /**
     * List of all identities
     * @type {Object.<ApiId>}
     */
    const identities = {};

    // ====================
    // Property: id
    if (includeId) {
        fake.id = id();
    }

    // ====================
    // Property: title
    if (titleWordMax) {
        fake.title = faker.lorem.words(titleWordMax);
    }

    // ====================
    // Property: text
    fake.text = faker.lorem.paragraphs(paragraphMax);

    // ====================
    // Property: oners
    fake.owners = _.uniq(owners).map((owner) => {
        // Creating the account
        accounts[owner] = api.toApiId(ResourceType.ACCOUNT, owner);
        return accounts[owner];
    });

    // ====================
    // Property: authors
    fake.authors = authors.map(({ account, identity }) => {
        // Creating account if not existing already
        if (!accounts[account]) {
            accounts[account] = api.toApiId(ResourceType.ACCOUNT, account);
        }

        // Creating the identity if not existing already
        if (!identities[identity]) {
            identities[identity] = api.toApiId(ResourceType.IDENTITY, identity);
        }

        return {
            account: accounts[account],
            identity: identities[identity],
        };
    });

    // ====================
    // Property: context
    fake.contexts = contexts.map(type => api.toApiId(type, faker.random.uuid()));

    return fake;
}

export {
    generate,
    id,
};
