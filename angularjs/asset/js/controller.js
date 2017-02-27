angular.module( 'myApp.controllers', [] )
	.controller( 'FinanceController', function( $scope ){
		$scope.salary = 0;
		$scope.percentage = 0;
		$scope.result = function(){
			return $scope.salary * $scope.percentage * 0.01;
		}
	})
	.controller( 'GreetingController', function( $scope ){
		this.now = new Date();
		this.helloMessages = ['Hello', 'Bonjour', 'Ola', 'Ciao', 'Hallo'];
		this.greeting = this.helloMessages[0];
		this.getRandomHelloMessages = function(){
			this.greeting = this.helloMessages[ parseInt((Math.random() * this.helloMessages.length))];
		}
	})