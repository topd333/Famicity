class FusionService {
  constructor(Fusion, $q) {
    this.Fusion = Fusion;
    this.pending = 'initiate,in_progress,waiting_treatment,famicity_handle';
    this.complete = 'cancel,error,finish,expired,refused';
    this.defaultLimit = 5;
    this.$q = $q;
  }
  query(params) {
    return this.$q((resolve, reject) => {
      return this.Fusion.query({
        user_id: params.userId,
        last_object_id: params.lastObjectId,
        limit: angular.isDefined(params.limit) ? params.limit : this.defaultLimit
      }).$promise
      .then(fusions => {
        fusions = fusions.fusions.map(fusion => {
          fusion.complete = this.complete.indexOf(fusion.state) >= 0;
          fusion.sent = fusion.sender.id === params.userId;
          return fusion;
        });
        resolve(fusions);
      })
      .catch(error => reject(error));
    });
  }
  getReceivedInProgress(params) {
    return this.Fusion.received({
      user_id: params.userId,
      state: this.pending,
      last_object_id: params.lastObjectId,
      limit: params.limit || this.defaultLimit
    }).$promise;
  }
  getReceivedComplete(params) {
    return this.Fusion.received({
      user_id: params.userId,
      state: this.complete,
      last_object_id: params.lastObjectId,
      limit: params.limit || this.defaultLimit
    }).$promise;
  }
  getSentInProgress(params) {
    return this.Fusion.sent({
      user_id: params.userId,
      state: this.pending,
      last_object_id: params.lastObjectId,
      limit: params.limit || this.defaultLimit
    }).$promise;
  }
  getSentComplete(params) {
    return this.Fusion.sent({
      user_id: params.userId,
      state: this.complete,
      last_object_id: params.lastObjectId,
      limit: params.limit || this.defaultLimit
    }).$promise;
  }
  cancel(params) {
    return this.Fusion.cancel({user_id: params.userId, id: params.id}).$promise;
  }
  accept(params) {
    return this.Fusion.accept({user_id: params.userId, id: params.id}).$promise;
  }
  refuse(params) {
    return this.Fusion.refuse({user_id: params.userId, id: params.id}).$promise;
  }
}

angular.module('famicity.fusions').service('fusionService', FusionService);
