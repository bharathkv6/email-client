import Util from './util';

class View {
  constructor() {
    this.emailListTemplate = document.getElementById(
      'email-list-item-template'
    );
    this.emailBodyTemplate = document.getElementById('email-body-template');
    this.emailWrapper = document.getElementById('email-wrapper');
    this.util = new Util();
  }

  onListItemClick = callback => {
    document.querySelector('.email-list').addEventListener('click', e => {
      const emailListItem = e.target.closest('.email-list-item');
      if (emailListItem) {
        callback(emailListItem.dataset.id);
      }
    });
  };

  onMarkAsFavorite = callback => {
    const button = document.querySelector('button.email-body__favorite-btn');
    button?.addEventListener('click', e => {
      const btnEl = e.target.closest('.email-body__favorite-btn');
      if (btnEl) {
        callback();
      }
    });
  };

  setEmailAsRead = id => {
    document.getElementById(`list-item-${id}`).classList.add('read');
  };

  markEmailAsFavorite = id => {
    const el = document
      .getElementById(`list-item-${id}`)
      .querySelector('.favorite.no-show');
    if (el) {
      el.classList.remove('no-show');
    }
  };

  onFilter = callback => {
    document.getElementById('filters').addEventListener('click', e => {
      const id = e.target.id;
      if (id) {
        document.querySelector('.active-filter').classList.remove('active-filter');
        e.target.classList.add('active-filter');
        callback(id);
      }
    });
  };

  renderEmailBody = (emailBody, email, isUnread) => {
    const {
      from: { name },
      subject,
      date
    } = email;
    if (isUnread) {
      this.setEmailAsRead(email.id);
    }
    const emailBodyClone = this.emailBodyTemplate.content.cloneNode(true);
    emailBodyClone.querySelector('.email-body__avatar > span').textContent =
      name[0].toUpperCase();
    emailBodyClone.querySelector('.email-body__title').textContent = subject;
    emailBodyClone.querySelector('.email-body__timestamp > span').textContent =
      this.util.formatDate(date);
    emailBodyClone.querySelector('.email-body__content').innerHTML =
      emailBody.body;
    const emailBodyElement = document.querySelector('.email-body');
    emailBodyElement.innerHTML = '';
    emailBodyElement.appendChild(emailBodyClone);
    emailBodyElement.classList.remove('no-show');
    const existingActiveEmail = document.querySelector('.active-email-item');
    if (existingActiveEmail) {
      existingActiveEmail.classList.remove('active-email-item');
    }
    document
      .querySelector(`#list-item-${email.id}.email-list-item`)
      .classList.add('active-email-item');
  };

  renderEmailListItem = (emailItem, fragment, isRead, isFavorite) => {
    const {
      id,
      from: { email, name },
      date,
      subject,
      short_description
    } = emailItem;
    const clone = this.emailListTemplate.content.cloneNode(true);
    clone.querySelector('.email-list-item__avatar > span').textContent =
      name[0].toUpperCase();
    clone.querySelector('.from').textContent = `${name} <${email}>`;
    clone.querySelector('.subject').textContent = subject;
    clone.querySelector('.description').textContent = short_description;
    clone.querySelector('.time').textContent = this.util.formatDate(date);
    const emailListItem = clone.querySelector('.email-list-item');
    emailListItem.id = `list-item-${id}`;
    emailListItem.dataset.id = id;
    if (isRead) {
      emailListItem.classList.add('read');
    }
    const favoriteEl = clone.querySelector('.favorite.no-show');
    if (isFavorite && favoriteEl) {
      favoriteEl.classList.remove('no-show');
    }
    fragment.appendChild(clone);
  };

  renderView = emailList => {
    console.log(emailList);
    const fragment = document.createDocumentFragment();
    emailList.filteredList.forEach(emailItem => {
      this.renderEmailListItem(
        emailItem,
        fragment,
        !!emailList.readEmails[emailItem.id],
        emailList.favoriteEmails.hasOwnProperty(emailItem.id)
      );
    });
    const emailListElement = this.emailWrapper.querySelector('.email-list');
    emailListElement.innerHTML = '';
    emailListElement.appendChild(fragment);
  };
}

export default View;
