用法：

	import Datatist from 'datatist-react'
	    
	const { DtMonthPicker } = Datatist;

	const model = {
		date: moment(),
		startDate: moment().subtract(7, 'days'),
		endDate: moment()
	};
	    
	<DtDaterangePicker model={model} onModel={this.selecDateRange} />
	
	selecDateRange(value) {
		this.setState({ month: value });
	}




