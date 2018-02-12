package com.sms_contacts;

import android.content.Intent;
import android.util.Log;
import com.facebook.react.ReactActivity;
import com.tkporter.sendsms.SendSMSPackage;

public class MainActivity extends ReactActivity {
    private final static String TAG = MainActivity.class.getSimpleName();

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "sms_contacts";
    }
	
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        //probably some other stuff here
        SendSMSPackage.getInstance().onActivityResult(requestCode, resultCode, data);
    }
}
