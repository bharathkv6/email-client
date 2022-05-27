import HttpClient from './http-client';
import Util from './util';
import View from './view';

class Renderer {
  constructor() {
    this.httpClient = new HttpClient();
    this.view = new View();
    this.util = new Util();
    const rawData = this.util.getLocalStorage('readEmails');
    const readEmails = rawData ? JSON.parse(rawData) : {};
    const favoriteRawData = this.util.getLocalStorage('favoriteEmails');
    const favoriteEmails = favoriteRawData ? JSON.parse(favoriteRawData) : {};
    this.store = new Proxy(
      {
        list: [],
        filteredList: [],
        total: 0,
        selectedEmail: {},
        selectedEmailBody: {},
        readEmails,
        favoriteEmails
      },
      {
        set: (target, key, value) => {
          if (key === 'list') {
            target[key] = value;
            target.filteredList = [...target.list];
            this.view.renderView(target);
          } else if (key === 'filteredList') {
            target[key] = value;
            this.view.renderView(target);
          } else if (key === 'total') {
            target[key] = value;
          } else if (key === 'selectedEmail') {
            target[key] = value;
          } else if (key === 'selectedEmailBody') {
            target[key] = value;
            const isUnread =
              target.readEmails.hasOwnProperty(target.selectedEmail.id) ===
              false;
            if (isUnread) {
              target.readEmails[target.selectedEmail.id] = true;
            }
            const rawData = JSON.stringify(target.readEmails);
            this.util.setLocalStorage('readEmails', rawData);
            this.view.renderEmailBody(
              target.selectedEmailBody,
              target.selectedEmail,
              isUnread
            );
            this.view.onMarkAsFavorite(() => {
              const selectedEmailId = this.store.selectedEmail.id;
              const favoriteEmails = { ...this.store.favoriteEmails };
              favoriteEmails[selectedEmailId] = true;
              this.store.favoriteEmails = favoriteEmails;
              this.view.markEmailAsFavorite(selectedEmailId);
            });
          } else if (key === 'favoriteEmails') {
            target[key] = value;
            const rawData = JSON.stringify(target.favoriteEmails);
            this.util.setLocalStorage('favoriteEmails', rawData);
          }
          return true;
        }
      }
    );

    this.view.onListItemClick(id => {
      this.store.selectedEmail = this.store.filteredList.find(
        emailItem => emailItem.id === id
      );
      this.fetchEmailBody(id);
    });

    this.view.onFilter(filter => {
      const favorites = this.store.favoriteEmails;
      const readEmails = this.store.readEmails;
      const filteredList = this.store.list.filter(
        item =>
          filter === 'all' ||
          (filter === 'unread' && !readEmails[item.id]) ||
          (filter === 'read' && !!readEmails[item.id]) ||
          (filter === 'favorites' && !!favorites[item.id])
      );
      this.store.filteredList = filteredList;
    });
  }

  fetchEmailBody = async id => {
    const emailBody = await this.httpClient.fetchEmailBody(id);
    this.store.selectedEmailBody = emailBody;
  };

  setState = emailList => {
    this.store.list = emailList.list;
    this.store.total = emailList.total;
  };
}

export default Renderer;
