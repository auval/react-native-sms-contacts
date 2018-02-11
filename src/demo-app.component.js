import React, {Component} from 'react';
import {PagedContacts} from 'react-native-paged-contacts';
import {View, FlatList, Text, Button} from 'react-native';
import * as SendSMS from "react-native-sms";

// function onButtonPressed(item) {
//   console.log('TTT', 'demo-app.component.js:40', 'onButtonPressed()', item);
// }
export default class DemoApp extends Component {
  constructor() {
    super();
    this.state = {
      data: {}
    };

    this.pagedContacts = new PagedContacts();

    this.getContacts().then(contacts => {
      this.contacts = contacts;

      let list = contacts.map(x => {
        console.log('TTT', 'demo-app.component.js:22', 'x=', JSON.stringify(x));
        return {
          key: x.identifier,
          label: x.displayName,
          phone: x.phoneNumbers?x.phoneNumbers[0].value:0
        }
      });
      this.setState({
        data: list
      });
    });
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
        <Text style={{fontWeight: 'bold'}}>Found {data.length} contacts</Text>
        <FlatList
          data={data}
          renderItem={({item}) => <Button onPress={() => this.onButtonPressed(item)} title={item.label}/>}
        />
      </View>
    );

  }

  onButtonPressed(item) {
    console.log('TTT', 'demo-app.component.js:60', 'onButtonPressed', item);

    let myOptionsObject = {
      body: 'The default body of the SMS!',
      recipients: [item.phone],
      successTypes: ['sent', 'queued']
    };

    SendSMS.send(myOptionsObject, (completed, cancelled, error) => {

      console.log('TTT', 'demo-app.component.js:66', 'SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);

    });

  }

}
