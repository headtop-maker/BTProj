package com.btproj;


import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager
import android.content.Context
import android.util.Log
import com.facebook.react.bridge.*


class BTModules(reactContext:ReactApplicationContext):ReactContextBaseJavaModule(reactContext){

    private var btAdapter: BluetoothAdapter? = null
    lateinit var btConnection: BtConnection

    override fun getName(): String {
        return "BTModule"
    }


    private fun init(): WritableMap {

      val btManager = reactApplicationContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        btAdapter = btManager.adapter
      return  getPairedDevices()
    }

    private fun getPairedDevices(): WritableMap {
        val resultData: WritableMap = WritableNativeMap()
        val pairedDevices:Set<BluetoothDevice>? = btAdapter?.bondedDevices
        pairedDevices?.forEach {
            resultData.putString(it.name,it.address)
        }
        return resultData
    }

    @ReactMethod
    fun getDevice(successCallback: Callback){
        successCallback.invoke(init())
    }

    @ReactMethod
    fun connectDevice(macAddress:String){
        Log.d("MyMac","$macAddress")
        val btManager = reactApplicationContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        val btAdapter = btManager.adapter
        btConnection = BtConnection(btAdapter)
        btConnection.connect(macAddress)
    }

}

