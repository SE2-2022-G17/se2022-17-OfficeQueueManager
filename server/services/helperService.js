
class HelperService {

    static convertServiceIdsObjectArray2ServiceIdsArray(serviceIds)
    {
        let result = [];

        for (const serviceId of serviceIds) {
            result.push(serviceId.serviceId);
        }

        return result;
    }
}

module.exports = HelperService;
