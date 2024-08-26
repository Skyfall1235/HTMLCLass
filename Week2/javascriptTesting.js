//it would be really funny if i locked a data type during usage and unlocked it when not
//we can use queues to stack info about an input, the method we wish to call, and the output

class MethodCallFromObject
{
    #object;
    get object()
    {
        return this.#object;
    }

    #methodCall;
    get methodCall()
    {
        return this.#methodCall;
    }

    #output;
    get output()
    {
        return this.#output;
    }

    constructor(object, methodCall, output)
    {
        this.#object = object;
        this.#methodCall = methodCall;
        this.#output = output;
    }
}

class Queue
{
    constructor() {}

    #objects = [];

    getCurrentObject()
    {
        if(objects[0] != null)
        {
            return objects[0];
        }
    }

    addNew(newObject)
    {
        this.#objects.push(newObject);
    }

    removeCurrentObject()
    {
        this.#objects.pop(0);
    }
}

class MethodQueue
{
    inPogress = false;

    queue = new Queue();
    //setter to ensure that we call the update even if this gets modified when we are planning to do so
    set Queue(inboundValue)
    {
        if(inboundValue.length > 0)
        {
            this.queue = value;
            this.checkForAsyncCalls();
        }
    }

    addMethodCallToQueue(inbound, method, outbound) 
    {
        //create the object we need in the datatype we need and then add it to the the queue
        var newMethodCall = new MethodCallFromObject(inbound, method, outbound);
        this.queue.addNew(newMethodCall);
    }

    async checkForAsyncCalls()
    {
        //confirm that we need to enter a queue loop
        if(this.queue != null && !this.inPogress )
        {
            EnterQueueLoop();
        }
    }

    EnterQueueLoop()
    {
        this.inPogress = true;
        //internal function because i need to performa a lot of these and i dont want it anywhere else
        function PerformItem(element)
        {
            if(element instanceof MethodCallFromObject)
            {
                var methodOutput = element.methodCall();
                element.output = methodOutput;
            }
        }


        loopDump = [];
        //this loops through the queue, calling the function asyncronously, and returning it to whatever it needs to be set as
        this.queue.forEach(element => 
        {
            PerformItem(element);
        });
    }
}