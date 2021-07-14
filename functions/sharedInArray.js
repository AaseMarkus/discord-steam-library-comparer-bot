//Takes an array of arrays and returns an array of values found in all arrays
module.exports = {
    execute(array)
    {
        let temp;

        for (let i = 0; i < array.length - 1; i++)
        {
            if (i === 0) temp = sharedtwo(array[0], array[1]);
            else temp = sharedtwo(temp, array[i + 1]);
        }

        return temp

        //Returns an array of values shared by the two argument arrays
        function sharedtwo(array1, array2) {
            //Creates a new array of shared values
            return array1.filter(value => array2.includes(value));
        }
    }
}