import { networkPost } from '../../utils/url_helper';
import DataStore from '../data_stores';
import Logger from '../../utils/logger';

export default class NetworkHandler {
  constructor(name) {
    this.cacheName = name;
    this.name = name;
  }

  _loadMultiple(elements) {
    Logger.info(`NetworkHandler::_loadMultiple2 : ${this.cacheName}`);
    return networkPost(`${this.name}/get-multiple`, JSON.stringify(elements))
      .catch((error) => {
        Logger.error('failed loading multiples 2');
        throw error;
      })
      .then((response) => {
        if (!response.data) {
          Logger.error('requested data not found');
          throw response;
        }
        return response.data;
      })
      .then((entries) => {
        const promises = entries.map(entry => DataStore.setElement(this.cacheName, entry._id, entry));
        return Promise.all(promises);
      });
  }
  getItems(ids) {
    Logger.info(`NetworkHandler::getItems : ${this.cacheName}`);
    // Logger.info(ids);
    if (ids.length === 0) {
      return Promise.resolve([]);
    }
    const newIds = ids.filter((x, i, a) => a.indexOf(x) === i);

    let promises = newIds.map((id) => {
      const entry = { _id: id, modifiedOn: new Date(0, 0, 0) };
      return DataStore.getElement(this.cacheName, id)
        .catch((error) => {
          Logger.error(error);
          if (error.code !== 404) {
            throw error;
          }
        })
        .then((element) => {
          if (element) {
            entry.modifiedOn = element.modifiedOn;
          }
          return entry;
        });
    });
    return Promise.all(promises)
      .then(entries =>
        // Logger.info(entries);
        this._loadMultiple(entries))
      .catch((error) => {
        Logger.error(error);
        throw error;
      })
      .then(() => {
        const data = [];
        promises = ids.map(id => DataStore.getElement(this.cacheName, id)
          .then((element) => {
            if (element) {
              data.push(element);
            }
          }));
        return Promise.all(promises)
          .then(() => data);
      })
      .then(data =>
        // Logger.info(data);
        data);
  }

  reportElement(elementId, comment, category, elementType) {
    Logger.info(`NetworkHandler::report : ${elementId} : ${elementType}`);
    return networkPost('common/report', JSON.stringify({
      elementId,
      comment,
      category,
      elementType,
    }))
      .catch((error) => {
        Logger.error(error);
        throw error;
      });
  }
}
