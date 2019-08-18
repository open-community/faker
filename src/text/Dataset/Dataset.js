// ============================================================
// Import modules
import { build } from './helpers';

// ============================================================
// Class
class TextDataset {
    constructor(texts) {
        this.texts = texts;

        this.accounts = {};
        this.owners = {};
        this.identities = {};
        this.authors = {};
        this.contexts = {};
        this.ids = {};

        this.texts.forEach((text) => {
            text.owners.forEach((owner) => {
                complete(this.owners, owner, text);
                complete(this.accounts, owner, text, 'owner');
            });

            text.authors.forEach(({ account, identity }) => {
                complete(this.authors, `${account}/${identity}`, text);
                complete(this.accounts, account, text, 'author');
                complete(this.identities, identity, text);
            });

            text.contexts.forEach((context) => {
                complete(this.contexts, context, text);
            });

            this.ids[text.id] = text;
        });
    }

    static create({
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
        const list = build({
            authors,
            accounts,
            identities,
            texts,
            contexts,
            maxOwnersByText,
            maxAuthorsByTexts,
            maxContextsByTexts,
            includeId,
            titleWordMax,
            paragraphMax,
        });

        return new TextDataset(list);
    }
}

function complete(set, id, data, subKey) {
    if (!set[id]) {
        // eslint-disable-next-line no-param-reassign
        set[id] = subKey ? {} : [];
    }

    if (subKey && !set[id][subKey]) {
        // eslint-disable-next-line no-param-reassign
        set[id][subKey] = [];
    }

    if (subKey) {
        set[id][subKey].push(data);
    }
    else {
        set[id].push(data);
    }
}

// ============================================================
//
export default TextDataset;
