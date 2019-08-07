// ============================================================
// Import packages
import faker from 'faker';
import { ResourceType, api } from '@open-community/service-tools';

// ============================================================
// Functions
function id() {
    return api.toApiId(
        ResourceType.ACCOUNT,
        faker.random.uuid,
    );
}

export {
    id,
};
