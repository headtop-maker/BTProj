package com.btproj;


import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothSocket
import android.content.Context
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.IOException
import java.io.InputStream
import java.io.OutputStream
import java.util.*
import kotlin.concurrent.thread


class BTModules(reactContext:ReactApplicationContext):ReactContextBaseJavaModule(reactContext){

    private var btAdapter: BluetoothAdapter? = null
    lateinit var btConnection: BtConnection
    var inStream: InputStream? = null
    var outStream: OutputStream? = null
    var mSocket: BluetoothSocket? = null
    var mEmitter: DeviceEventManagerModule.RCTDeviceEventEmitter? = null
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

    fun sendEvent(eventName: String, message: String) {
        val params = Arguments.createMap()
        params.putString("message", message)
        if (mEmitter == null) {
            mEmitter = reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        }
        mEmitter?.emit(eventName, params)
    }
    fun sendOnUI(eventName: String, message: String) {
        UiThreadUtil.runOnUiThread(Runnable {
            sendEvent(eventName, message)
        })
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

    @ReactMethod
    fun connectDeviceFC(macAddress:String){
        val btManager = reactApplicationContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        val btAdapter = btManager.adapter
        if (btAdapter.isEnabled && macAddress.isNotEmpty()) {
            val device = btAdapter.getRemoteDevice(macAddress)
            device.let {
                Log.d("MyMac", macAddress)
                connectThread(it)
            }
        }
    }

    private fun connectThread(device: BluetoothDevice){
        val uuid = "00001101-0000-1000-8000-00805F9B34FB"

        mSocket = device.createRfcommSocketToServiceRecord(UUID.fromString(uuid))
        thread {
            try {
                Log.d("MyLog", "Connecting... ")
                mSocket?.connect()
                Log.d("MyLog", "Connected ")
                receiveThread()
            } catch (i: IOException) {
                Log.d("MyLog", "Can not connected ")
               closeConnection()
            }
        }
    }

    fun closeConnection(){
        try {
            mSocket?.close()
        }catch (e:IOException){

        }
    }

    fun receiveThread (){
        val buf = ByteArray(4000000)

        try {
            inStream = mSocket?.inputStream
        } catch (i: IOException) {
        }
        try {
            outStream = mSocket?.outputStream
        } catch (i: IOException) {
        }
        thread {
            var frame =""
        while (true) {

            try {

                val size = inStream?.read(buf)
                val message = String(buf, 0, size!!)

                if(!message.toBoolean()) {
//                    Log.d("MyLog",message)
                    frame+=message
                    if(message.length<330){
                        sendOnUI("status", "refresh")
//                        Thread.sleep(100)
                      sendOnUI("base64",frame)
                        frame=""
                    }
                }

            } catch (i: IOException) {
                break
                 }
             }
        }
    }


    @ReactMethod
    fun sendMessage(message: String) {
        try {
            outStream?.write(message.toByteArray())
        } catch (i: IOException) {

        }
    }

}

