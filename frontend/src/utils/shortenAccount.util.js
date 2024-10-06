const shortenAccount = (account) => {
    if (account) {
        return account.substring(0, 6) + "..." + account.substring(account.length - 4, account.length);
    } else {
        console.log("Account format error");
    }
}

export default shortenAccount