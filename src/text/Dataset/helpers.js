// ============================================================
// Import packages
import faker from 'faker';

// ============================================================
// Import modules
import { generate } from '../text';

// ============================================================
// Functions
/**
 * Build a dataset
 * @param {number|Array.<{account: Id, identity: Id}>} authors
 * @public
 */
function build({
    authors = 10,
    accounts = 10,
    identities = 10,
    texts = 20,
    contexts = 10,
    maxOwnersByText = 3,
    maxAuthorsByTexts = 3,
    maxContextsByTexts = 3,
    includeId = true,
    titleWordMax = 10,
    paragraphMax = 3,
} = {}) {
    const listAuthors = typeof authors === 'number'
        ? generateAuthors(accounts, identities, authors)
        : authors;

    const listContexts = typeof contexts === 'number'
        ? Array(contexts).fill(undefined).map(() => faker.random.uuid())
        : [...listContexts];

    const listTexts = Array(texts)
        .fill(undefined)
        .map(() => {
            const nbAuthors = faker.random.number(maxAuthorsByTexts - 1) + 1;
            const nbContexts = faker.random.number(maxContextsByTexts - 1) + 1;
            const nbOwners = faker.random.number(maxOwnersByText - 1) + 1;

            const textAuthors = Array(nbAuthors)
                .fill(undefined)
                .map(() => {
                    const author = faker.helpers.randomize(listAuthors);
                    return author;
                });

            const textContexts = Array(nbContexts)
                .fill(undefined)
                .map(() => {
                    const context = faker.helpers.randomize(listContexts);
                    return context;
                });

            const textOwners = Array(nbOwners)
                .fill(undefined)
                .map(() => {
                    const owner = faker.helpers.randomize(textAuthors).account;
                    return owner;
                });

            return generate({
                authors: textAuthors,
                contexts: textContexts,
                includeId,
                owners: textOwners,
                paragraphMax,
                titleWordMax,
            });
        });

    return listTexts;
}

function generateAuthors(
    nbAccounts,
    nbIdentities,
    nbAuthors,
) {
    const accounts = Array(nbAccounts || nbAuthors)
        .fill(undefined)
        .map(() => faker.random.uuid());

    const identities = Array(nbIdentities || nbAuthors)
        .fill(undefined)
        .map(() => faker.random.uuid());

    const owners = Array(nbAuthors)
        .fill(undefined)
        .map(() => ({
            account: faker.helpers.randomize(accounts),
            identity: faker.helpers.randomize(identities),
        }));

    return owners;
}

// ============================================================
// Exports
export { build };
