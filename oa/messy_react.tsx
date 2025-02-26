interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added blockchain to WalletBalance, I assume currency is not the blockchain itself (since the JSON prices.json file uses ETH, where getPriority uses Ethereum)
}
interface FormattedWalletBalance {
  blockchain: string; // Added blockchain to FormattedWalletBalance
  currency: string;
  amount: number;
  formatted: string; 
}

class Datasource {
  // TODO: Implement datasource class
  private url: string;
  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<any> {
    const response = await fetch(this.url);

    // Parse the data into the proper format.
    const data = await response.json();

    const prices: any = {};
    data.forEach((item: { currency: string; price: number; date: string }) => {
      prices[item.currency] = item.price;
    })
    return prices;  
  }
}

// Unimplemented interface
interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;

  // clarifying the type, I assume its an array of balance since we are using array functions later (filter, map, sort)
  const balances: WalletBalance[] = useWalletBalances();

  // Having a typing to prices will have programmer understand how prices should look like
	const [prices, setPrices] = useState<{ [key: string]: number }>({}); 

  useEffect(() => {
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    datasource.getPrices().then(prices => {
      setPrices(prices);
    }).catch(error => {
      console.error(error); // should be console.error
    });
  }, []);

  // LGTM
	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  // I combined sortedBalance, formatedBalance and rows into a single useMemo, as the change in balances/ prices will result in a domino effect and re-render the DOM
  const rows = useMemo(() => { // Sorts balance when balances/ prices changes
    return balances.filter((balance: WalletBalance) => { // Filtering out balances with 0 or negative amount
		  const balancePriority = getPriority(balance.blockchain);
		  if (balancePriority > -99 && balance.amount >= 0) { // I believe we want only want to filter out when the balance have a priority + the account has a valid amount (>= 0)
		    return true;
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => { // sorting by descending order of priority (high priority to low priority)
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
      return 0; // For situation where both priorities are equal
    }).map((balance: WalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed(),
    })).map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow // Will have to input this component
          className={classes.row} // Ensure `classes.row` is defined, otherwise remove it
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted} // Use the formatted string
        />
      );
    });
  }, [balances, prices]);

  

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}