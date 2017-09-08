## Tree

### Tree layout

#### Tree user

##### Current tree user

Applied with `.tr-us-fi`.

%% result %%
```
<div class="tr-com us tr-us-fi tr-us-ma pointer" tooltip-html-unsafe="Dupont Guillaume <br>20/10/1980" tooltip-append-to-body="true" tooltip-placement="bottom">
  <div class="tr-us">
    <img src="https://placekitten.com/g/600/600" alt="a">
    <div class="tr-te">
      <span style="font-weight:bold;font-size:14px;color:#89c532;"> o</span>
      Guillaume
    </div>
  </div>
</div>
```

##### Male tree user

Applied with `.tr-us-ma`.

%% result %%
```
<div id="tr-com-6252" class="tr-com us tr-us-ma pointer" tooltip-html-unsafe="Dupont Guillaume <br>20/10/1980" tooltip-append-to-body="true" tooltip-placement="bottom">
  <div class="tr-us">
    <img src="https://placekitten.com/g/600/600" alt="a">
    <div class="tr-te">
      <span style="font-weight:bold;font-size:14px;color:#89c532;"> o</span>
      Guillaume
    </div>
  </div>
</div>
```

##### Female tree user

Applied with `.tr-us-fe`.

%% result %%
```
<div id="tr-com-6254" class="tr-com us tr-us-fe pointer" tooltip-html-unsafe="Dupont Guillaume <br>20/10/1980" tooltip-append-to-body="true" tooltip-placement="bottom">
  <div class="tr-us">
    <img src="https://placekitten.com/g/600/600" alt="a">
    <div class="tr-te">
      <span style="font-weight:bold;font-size:14px;color:#89c532;"> o</span>
      Guillaumette
    </div>
  </div>
</div>
```

##### Deceased detailed tree user

Applied with `.tr-com us tr-us-ma`.

%% result %%
```
<div class="detailed"><!-- tree level class -->
<div class="tr-com us tr-us-ma">
  <div class="tr-us">
    <img src="https://placekitten.com/g/600/600" alt="a">
  </div>
  <div class="tr-us-info">
    <div class="name">
      <span class="first-name">Guillaumette</span> <span class="last-name">Dupont</span>
    </div>
    <div class="maiden">
      <i>Née</i> <span class="maiden-name">Elancourt</span>
    </div>
    <div class="dates-and-places">
    (1940-1988), Montigny
    </div>
  </div>
</div>
</div>
```

##### Detailed tree user

Applied with `.tr-com us tr-us-ma`.

%% result %%
```
<div class="detailed"><!-- tree level class -->
<div class="tr-com us tr-us-ma">
  <div class="tr-us">
    <img src="https://placekitten.com/g/600/600" alt="a">
  </div>
  <div class="tr-us-info">
    <div class="name">
     <span class="first-name">Guillaumette</span> <span class="last-name">Dupont</span>
    </div>
    <div class="maiden">
      <i>Née</i> <span class="maiden-name">Elancourt</span>
    </div>
    <div class="dates-and-places">
      <i class="fa fa-gift"></i> 20/07/1940 à Paris
    </div>
    <div class="notif">
      <a class="fusions" ng-click="showFusions(6252)"><i class="fa fa-link"></i> Fusions en cours</a>
    </div>
  </div>
  <div class="tr-te actions">
    <div class="start">
      <div class="membership member">
        <span class="circle"> &#9675;</span> Membre
      </div>
    </div>
  </div>
</div>
</div>
```

##### Invited tree user

Applied with `.tr-com us tr-us-ma`.

%% result %%
```
<div class="detailed"><!-- tree level class -->
<div class="tr-com us tr-us-ma">
  <div class="tr-us">
    <img src="https://placekitten.com/g/600/600" alt="a">
  </div>
  <div class="tr-us-info">
    <div class="name">
     <span class="first-name">Guillaumette</span> <span class="last-name">Dupont</span>
    </div>
    <div class="maiden">
      <i>Née</i> <span class="maiden-name">Elancourt</span>
    </div>
    <div class="dates-and-places">
      <i class="fa fa-gift"></i> 20/07/1940 à Paris
    </div>
    <div class="notif">
      <a class="fusions" ng-click="showFusions(6252)"><i class="fa fa-link"></i> Fusions en cours</a>
    </div>
  </div>
  <div class="tr-te actions">
    <div class="start">
      <div class="membership invited">
        <span class="circle"> &#9675;</span> Invité
      </div>
    </div>
  </div>
</div> 
</div>
```

##### Non-member detailed tree user

Applied with `.tr-com us tr-us-ma`.

%% result %%
```
<div class="detailed"><!-- tree level class -->
<div class="tr-com us tr-us-ma">
  <div class="tr-us">
    <img src="https://placekitten.com/g/600/600" alt="a">
  </div>
  <div class="tr-us-info">
    <div class="name">
      <span class="first-name">Guillaumette</span> <span class="last-name">Dupont</span>
    </div>
    <div class="maiden">
      <i>Née</i> <span class="maiden-name">Elancourt</span>
    </div>
    <div class="dates-and-places">
     <i class="fa fa-gift"></i> 20/07/1940 à Paris
    </div>
  </div>
  <div class="tr-te actions">
    <div class="end">
     <button class="btn btn-primary" type="submit">Inviter</button>
    </div>
  </div>
</div>
</div>
```

##### Unknown detailed tree user

Applied with `tr-us-un`.

%% result %%
```
<div class="detailed"><!-- tree level class -->
<div class="tr-com us tr-us-ma tr-us-un">
  <div class="qm">
    ?
  </div>
  <div class="tr-us-info">
    Personne non renseignée
  </div>
  <div class="tr-te actions">
    <div class="end">
     <button class="btn btn-secondary" type="submit">Compléter</button>
    </div>
  </div>
</div>
</div>
```
