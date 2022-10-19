const dao = require('../dao');
const HelperService = require('./helperService');

class QueueService {

    /**
     * take one client from queue
     * @param counterId
     * @return {number}
     */
    static async getNextQueue(counterId)
    {
        // counter serving service ids by counter id
        const countersServices = await dao.getServiceIdsByCounterId(counterId)
                                            .then( countersServices => countersServices )
                                            .catch(error => { console.log(error) });

        // traverse all counter's services and find number of reservations for each service
        const serviceReservationCounts = await this.serviceReservationsCount(countersServices);

        // find which service reservation longest
        const maxServiceId = this.findMaxReservationService(serviceReservationCounts);

        // if such service not exists rise error
        if (maxServiceId === 0)
            return 'No reservations';
        else {

            // get one ore more services with same reservation numbers or return one
            const maxServiceIds = this.getAllMaxValues(maxServiceId, serviceReservationCounts);

            // true chosen service after filters
            let chosenServiceId;

            // if many service queue with same length
            if (maxServiceIds.length > 1)
                // order by service time and return result
                chosenServiceId = await dao.getLowestTimeService(maxServiceIds)
                                            .then(serviceId => serviceId)
                                            .catch(error => { console.log(error) });
            else
                chosenServiceId = maxServiceIds[0];

            const service = await dao.getServiceById(chosenServiceId)
                                        .then(service => service)
                                        .catch(error => { console.log(error) });

            const reservation = await dao.getServiceFirstReservation(chosenServiceId)
                                            .then(reservation => reservation)
                                            .catch(error => { console.log(error) });

            const feedback = await dao.deleteReservation(reservation.id)
                                        .then(result => result)
                                        .catch(error => { console.log(error) });
            // const feedback = 1;

            // if true return code otherwise error message
            if (feedback)
                return service.tag + reservation.id;
            else
                return feedback;
        }
    }

    static async getQueue()
    {
        let result = {};

        const counters = await dao.getCounters()
                                    .then(counters => counters)
                                    .catch(error => { console.log(error) });

        const services = await dao.getServices()
                                    .then(services => services)
                                    .catch(error => { console.log(error) });

        for (const counter of counters) {

            let serviceIds = await dao.getServiceIdsByCounterId(counter.id)
                                        .then(serviceIds => serviceIds)
                                        .catch(error => { console.log(error) });

            serviceIds = HelperService.convertServiceIdsObjectArray2ServiceIdsArray(serviceIds);

            if (serviceIds.length === 0) {
                result[counter.id] = false;
                continue;
            }


            const reservations = await dao.getReservationsByServiceIds(serviceIds)
                                            .then(reservations => reservations)
                                            .catch(error => { console.log(error) });

            for (const reservation of reservations) {

                const lengthAhead = this.countReservationsBeforeOneReservation(reservations, reservation);

                const averageServiceTime = this.calculateServicesAverage(services, serviceIds);

                const waitingTime = this.calculateReservationWaitingTime(averageServiceTime, serviceIds, lengthAhead);

            }
        }
    }

    static calculateServicesAverage(services, serviceIds)
    {
        let counter = 0, sum = 0;

        for (const service of services) {
            if (serviceIds.includes(service.id)) {
                counter++;
                sum += service.time;
            }
        }

        return sum / counter;
    }

    static countReservationsBeforeOneReservation(reservations, needleReservation)
    {
        let counter = 0;

        for (const reservation of reservations) {
            if (reservation.id !== needleReservation.id) counter++;
            else break;
        }

        return counter;
    }

    /**
     * traverse all counter services and find number of reservations for each service
     * @param countersServices
     * @return {$ObjMap}
     */
    static async serviceReservationsCount(countersServices)
    {
        let serviceReservationCounts = {};

        // traverse each counter service
        for (const countersService of countersServices) {

            const serviceId = countersService.serviceId;

            // get service reservations count
            serviceReservationCounts[serviceId] = await dao.getReservationsCountByService(serviceId)
                .then(count => count )
                .catch(error => { console.log(error) });
        }

        return serviceReservationCounts;
    }

    static calculateReservationWaitingTime(averageServiceTime, numberOfServices, numberOfPeopleAhead)
    {
        return averageServiceTime * ( ( numberOfPeopleAhead / ( 1 / numberOfServices ) ) + 0.5 );
    }

    /**
     * find minimum queue ( reservations ) among many
     * @param serviceReservationCounts
     * @return {number}
     */
    static findMaxReservationService(serviceReservationCounts)
    {
        let maxServiceId = Number.MIN_VALUE, maxNumber = Number.MIN_VALUE;

        for (const serviceId in serviceReservationCounts) {

            const countNumber = serviceReservationCounts[serviceId].reservationsCount;

            if (countNumber > maxNumber) {
                maxNumber    = countNumber;
                maxServiceId = serviceId;
            }
        }

        // if no min service id found
        if (maxNumber === Number.MIN_VALUE)
            return 0;
        else
            return maxServiceId;
    }

    /**
     * Gets all min service ids if many
     * @param maxServiceId
     * @param serviceReservationCounts
     * @return {Array}
     */
    static getAllMaxValues(maxServiceId, serviceReservationCounts)
    {
        const maxCountNumber = serviceReservationCounts[maxServiceId].reservationsCount;

        let result = [];

        for (const serviceId in serviceReservationCounts) {

            const countNumber = serviceReservationCounts[serviceId].reservationsCount;

            if (maxCountNumber === countNumber) result.push(serviceId);

        }

        return result;
    }
}

module.exports = QueueService;
