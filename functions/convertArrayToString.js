module.exports = {
    //Converts an array to a string seperated by commas + and. before = text to place before each element, after = text to place after each element
    execute(array, before = "", after = "")
    {
        let output = "";
        array.forEach((element, index) => {
            let text = `${before}${element}${after}`

            if(index === 0) output += `${text}`;
            else if (index === array.length-1) output += ` and ${text}`
            else output += `, ${text}`
        });

        return output;
    }
}