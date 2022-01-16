import React, { Component } from 'react';
import shortid from 'shortid';
import { ToastContainer, toast } from 'react-toastify';
import Container from './components/Container/Container';
import Section from './components/Section/Section';
import ContactsList from './components/ContactsList/ContactsList';
import Filter from './components/Filter/Filter';
import Form from './components/Form/Form';
import Modal from './components/Modal/Modal';
import IconButton from './components/IconButton/IconButton';
import { ReactComponent as AddIcon } from './icons/add.svg';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
    showModal: false,
  };

  componentDidMount() {
    console.log('componentDidMount');
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({
        contacts: parsedContacts,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const nextContacts = this.state.contacts;
    const prevContacts = prevState.contacts;

    if (nextContacts !== prevContacts) {
      localStorage.setItem('contacts', JSON.stringify(nextContacts));
    }

    if (
      nextContacts.length > prevContacts.length &&
      prevContacts.length !== 0
    ) {
      this.toggleModal();
    }
  }

  addContact = ({ name, number }) => {
    const contact = {
      id: shortid.generate(),
      name,
      number,
    };
    const { contacts } = this.state;
    if (contacts.find(contact => contact.name === name)) {
      toast.error(`${name} is already in contacts`, {
        position: 'top-center',
        autoClose: 2000,
        theme: 'colored',
      });
    } else {
      this.setState(prevState => ({
        contacts: [...prevState.contacts, contact],
      }));
    }
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = e => {
    this.setState({
      filter: e.currentTarget.value,
    });
  };

  getVisibleContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter),
    );
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  render() {
    const { filter, showModal } = this.state;
    const visibleContacts = this.getVisibleContacts();
    return (
      <Container>
        <IconButton onClick={this.toggleModal} aria-label="Добавить Contact">
          <AddIcon fill="white" width="30" height="30" />
        </IconButton>
        <Section title="Phonebook">
          {showModal && (
            <Modal onClose={this.toggleModal}>
              <Form onSubmit={this.addContact}></Form>
            </Modal>
          )}
        </Section>
        <Section title="Contacts">
          <Filter value={filter} onChange={this.changeFilter} />
          <ContactsList
            contacts={visibleContacts}
            onDeleteContact={this.deleteContact}
          ></ContactsList>
        </Section>
        <ToastContainer />
      </Container>
    );
  }
}

export default App;
