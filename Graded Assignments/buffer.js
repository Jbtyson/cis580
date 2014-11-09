 Basically I am creating a data type that represents a "fixed-length binary data buffer".
 We use data views to convert that buffer into meaningful data such as the example provided
 where they initialize a 16 byte buffer and then we create a view that treats the buffer as an array of 32 bit signed integers,
 giving us 4 integers.  I know that constructor deals with the buffer, the offset, and the length of the array
 but I am not sure if setting it up like this would do what we want it to do.
 
 //32 + 32 + 16 + 8 bits = 4 + 4 + 2 + 1 bytes = 11 bytes per object
 sizeOfObject = 11;
 var buffer = new ArrayBuffer(100 * sizeOfObject);
 
 var xView = new Float32Array(buffer, 0, 100)
 var yView = new Float32Array(buffer, 1, 100)
 var lifeView = new InUint16Array(buffer, 2, 100)
 var stateView = new InUint8Array(buffer, 3, 100)