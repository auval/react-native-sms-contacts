import React, {Component} from 'react';
import {PagedContacts} from 'react-native-paged-contacts';
import {View, FlatList, Text, Button} from 'react-native';
import * as SendSMS from "react-native-sms";
import {PermissionsAndroid} from 'react-native';

export default class DemoApp extends Component {
  constructor() {
    super();
    this.state = {
      smsPermission: undefined,
      contactsPermission: undefined,
      status: undefined,
      data: {}
    };

    this.pagedContacts = new PagedContacts()

    this.readContacts()

  }

  async getContacts() {
    const granted = await this.pagedContacts.requestAccess();
    if (granted) {
      const count = await this.pagedContacts.getContactsCount();
      return await this.pagedContacts.getContactsWithRange(0, 100, [PagedContacts.displayName, PagedContacts.phoneNumbers, PagedContacts.emailAddresses]);
    } else {
      console.warn('Permissions issue');
    }
  }


  render() {
    const {data} = this.state;

    return (
      <View>
        <Text>READ CONTACTS Permission {this.state.contactsPermission ? "granted!" : "NOT granted :("}</Text>
        <Text>SMS SEND Permission {this.state.smsPermission ? "granted!" :
          this.state.smsPermission === undefined ? "UNDEFINED" : "NOT granted :("}</Text>
        <Text style={{fontWeight: 'bold'}}>Found {data.length ? data.length : 0} contacts</Text>
        <FlatList
          data={data}
          renderItem={({item}) => <Button onPress={() => this.onButtonPressed(item)} title={item.label}/>}
        />
        <Text>{this.state.status ? this.state.status : ''}</Text>
      </View>
    );
  }

  onButtonPressed(item) {
    this.requestSmsSendPermission()
    if (this.state.smsPermission) {
      let myOptionsObject = {
        body: 'The default body of the SMS!',
        recipients: [item.phone],
        direct_send: true,
        successTypes: ['sent', 'queued']
      };
      SendSMS.send(myOptionsObject, (completed, cancelled, error) => {
        this.setState({
          status: 'An SMS was sent to ' + item.label
        })
      });
    } else {
      console.log('TTT', 'demo-app.component.js', 'onButtonPressed', 'skipped sms sending (no permission)');
    }
  }

  async requestSmsSendPermission() {
    try {
      const granted = await
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
          {
            'title': 'Sending SMS',
            'message': 'Inviting members needs permission to send SMS'
          }
        )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can send SMS")
        this.setState({
          smsPermission: true
        });
      } else {
        console.log("Permission to send SMS was denied")
        this.setState({
          smsPermission: false
        });
      }
    } catch (err) {
      console.warn(err)
    }
  }

  async requestContactsReadPermission() {
    try {
      const granted = await
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            'title': 'Reading Contacts',
            'message': 'Inviting members needs permission to read your phone contacts'
          }
        )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        if (this.state.contactsPermission === false) {
          // was denied before
          readContacts();
        }
        this.setState({
          contactsPermission: true
        });
      } else {
        this.setState({
          contactsPermission: false
        });
      }
    } catch (err) {
      console.warn(err)
    }
  }

  async readContacts() {

    await this.requestContactsReadPermission()
    await this.getContacts().then(contacts => {
      this.contacts = contacts;
      let list = contacts.map(x => {

        return {
          key: x.identifier,
          label: x.displayName,
          phone: x.phoneNumbers ? x.phoneNumbers[0].value : 0
        }
      });
      this.setState({
        data: list
      });
    });
  }
}