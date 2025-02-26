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
  const balances = useWalletBalances();

  // Having a typing to prices will have programmer understand how prices should look like
	const [prices, setPrices] = useState({}); 

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


  const sortedBalances = useMemo(() => { // Sorts balance when balances/ prices changes
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
    });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed() 
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row} // I assume classes is defined somewhere, if not it should be removed.
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance} // Already formatted
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}