用法：

	import Datatist from 'datatist-react'
	    
	const { DtDatetimePicker } = Datatist;
	    
	<DtDatetimePicker options={{ rangeMode: 'selectWeek', rangeSpan: 14 }} onModel={this.selectDateTime} />
	
	selectDateTime(value) {
		this.setState({ month: value });
	}